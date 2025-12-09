import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { DOMParser } from "npm:linkedom@0.18.2";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ValidationRequest {
  xmlContent: string;
}

interface ValidationError {
  line?: number;
  column?: number;
  message: string;
  code: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { xmlContent }: ValidationRequest = await req.json();

    if (!xmlContent) {
      return new Response(
        JSON.stringify({ error: "XML content is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    const errors: ValidationError[] = [];

    const dangerousPatterns = ["--", "/*", "&#"];
    for (const pattern of dangerousPatterns) {
      if (xmlContent.includes(pattern)) {
        errors.push({
          message: `Failed Threat Scan: The receiving Competent Authority detected one or more potential security threats. Character combination "${pattern}" is not allowed.`,
          code: "50005",
        });
        break;
      }
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlContent, "text/xml");

    const parseError = doc.querySelector("parsererror");
    if (parseError) {
      errors.push({
        message: `Failed Schema Validation: The referenced file failed validation against the CRS XML Schema. ${parseError.textContent}`,
        code: "50007",
      });
    }

    const allElements = doc.getElementsByTagName("*");

    for (let i = 0; i < allElements.length; i++) {
      const element = allElements[i];
      const localName = element.localName || element.tagName.split(':').pop();

      if (localName === "CorrDocRefId") {
        const corrDocRefId = element.textContent?.trim();

        if (corrDocRefId) {
          const { data } = await supabase
            .from("aeoi_record")
            .select("doc_ref_id")
            .eq("doc_ref_id", corrDocRefId)
            .maybeSingle();

          if (!data) {
            errors.push({
              message: `CorrDocRefId "${corrDocRefId}" does not match any previously uploaded DocRefId.`,
              code: "80002",
            });
          }
        }
      }
    }

    const response = {
      valid: errors.length === 0,
      errors: errors,
      message: errors.length === 0
        ? "XML validation passed"
        : `XML validation failed with ${errors.length} error(s)`,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Validation error:", error);
    return new Response(
      JSON.stringify({
        valid: false,
        errors: [{
          message: `Server error during validation: ${error instanceof Error ? error.message : "Unknown error"}`,
          code: "50000",
        }],
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});