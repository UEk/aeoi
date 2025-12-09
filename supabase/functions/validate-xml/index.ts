import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { DOMParser } from "npm:linkedom@0.18.2";

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

    const errors: ValidationError[] = [];

    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlContent, "text/xml");

    const parseError = doc.querySelector("parsererror");
    if (parseError) {
      errors.push({
        message: `XML parsing error: ${parseError.textContent}`,
        code: "50001",
      });
    }

    if (!doc.querySelector("parsererror")) {
      const rootElement = doc.documentElement;
      const isCrsOecd = rootElement?.localName === "CRS_OECD";
      const isMessageBody = rootElement?.localName === "MessageBody";

      if (!isCrsOecd && !isMessageBody) {
        errors.push({
          message: "Missing required CRS_OECD or MessageBody root element",
          code: "50002",
        });
      }

      const allElements = doc.getElementsByTagNameNS("*", "*");
      const messageSpec = Array.from(allElements).find(el => el.localName === "MessageSpec");
      if (!messageSpec) {
        errors.push({
          message: "Missing required MessageSpec element",
          code: "50003",
        });
      } else {
        const specElements = messageSpec.getElementsByTagNameNS("*", "*");
        const transmittingCountry = Array.from(specElements).find(el => el.localName === "TransmittingCountry");
        const receivingCountry = Array.from(specElements).find(el => el.localName === "ReceivingCountry");
        const messageType = Array.from(specElements).find(el => el.localName === "MessageType");
        const messageRefId = Array.from(specElements).find(el => el.localName === "MessageRefId");
        const messageTypeIndic = Array.from(specElements).find(el => el.localName === "MessageTypeIndic");

        if (!transmittingCountry || !transmittingCountry.textContent?.trim()) {
          errors.push({
            message: "Missing or empty TransmittingCountry in MessageSpec",
            code: "50006",
          });
        } else {
          const country = transmittingCountry.textContent?.trim();
          if (country && country.length !== 2) {
            errors.push({
              message: `TransmittingCountry must be a 2-letter ISO country code, got: ${country}`,
              code: "50007",
            });
          }
        }

        if (!receivingCountry || !receivingCountry.textContent?.trim()) {
          errors.push({
            message: "Missing or empty ReceivingCountry in MessageSpec",
            code: "50008",
          });
        } else {
          const country = receivingCountry.textContent?.trim();
          if (country && country.length !== 2) {
            errors.push({
              message: `ReceivingCountry must be a 2-letter ISO country code, got: ${country}`,
              code: "50010",
            });
          }
        }

        if (!messageType || messageType.textContent?.trim() !== "CRS") {
          errors.push({
            message: "MessageType must be 'CRS'",
            code: "50011",
          });
        }

        if (!messageRefId || !messageRefId.textContent?.trim()) {
          errors.push({
            message: "Missing or empty MessageRefId in MessageSpec",
            code: "50009",
          });
        }

        if (!messageTypeIndic || !messageTypeIndic.textContent?.trim()) {
          errors.push({
            message: "Missing or empty MessageTypeIndic in MessageSpec",
            code: "50013",
          });
        } else {
          const validCrsIndicators = ["CRS701", "CRS702", "CRS703"];
          const validOecdIndicators = ["OECD0", "OECD1", "OECD2", "OECD3", "OECD10", "OECD11", "OECD12", "OECD13"];
          const allValidIndicators = [...validCrsIndicators, ...validOecdIndicators];
          const indic = messageTypeIndic.textContent?.trim();
          if (indic && !allValidIndicators.includes(indic)) {
            errors.push({
              message: `Invalid MessageTypeIndic value: ${indic}. Must be one of: ${allValidIndicators.join(", ")}`,
              code: "50014",
            });
          }
        }
      }

      const reportingPeriod = Array.from(allElements).find(el => el.localName === "ReportingPeriod");
      if (!reportingPeriod || !reportingPeriod.textContent?.trim()) {
        errors.push({
          message: "Missing or empty ReportingPeriod",
          code: "50015",
        });
      } else {
        const period = reportingPeriod.textContent?.trim();
        if (period && !/^\d{4}-\d{2}-\d{2}$/.test(period)) {
          errors.push({
            message: `Invalid ReportingPeriod format: ${period}. Expected format: YYYY-MM-DD`,
            code: "50016",
          });
        }
      }

      const accountReports = Array.from(allElements).filter(el => el.localName === "AccountReport");
      if (accountReports.length === 0) {
        errors.push({
          message: "No AccountReport elements found in XML",
          code: "50017",
        });
      } else {
        accountReports.forEach((report, index) => {
          const reportElements = report.getElementsByTagNameNS("*", "*");
          const docRefId = Array.from(reportElements).find(el => el.localName === "DocRefId");
          if (!docRefId || !docRefId.textContent?.trim()) {
            errors.push({
              message: `AccountReport ${index + 1}: Missing or empty DocRefId`,
              code: "50018",
            });
          }

          const accountNumber = Array.from(reportElements).find(el => el.localName === "AccountNumber");
          if (!accountNumber || !accountNumber.textContent?.trim()) {
            errors.push({
              message: `AccountReport ${index + 1}: Missing or empty AccountNumber`,
              code: "50019",
            });
          }

          const accountHolder = Array.from(reportElements).find(el => el.localName === "AccountHolder");
          if (!accountHolder) {
            errors.push({
              message: `AccountReport ${index + 1}: Missing AccountHolder element`,
              code: "50020",
            });
          } else {
            const holderElements = accountHolder.getElementsByTagNameNS("*", "*");
            const individual = Array.from(holderElements).find(el => el.localName === "Individual");
            const organisation = Array.from(holderElements).find(el => el.localName === "Organisation");

            if (!individual && !organisation) {
              errors.push({
                message: `AccountReport ${index + 1}: AccountHolder must contain either Individual or Organisation`,
                code: "50021",
              });
            }

            if (individual) {
              const individualElements = individual.getElementsByTagNameNS("*", "*");
              const resCountryCode = Array.from(individualElements).find(el => el.localName === "ResCountryCode");
              if (!resCountryCode || !resCountryCode.textContent?.trim()) {
                errors.push({
                  message: `AccountReport ${index + 1}: Missing or empty ResCountryCode in Individual`,
                  code: "50022",
                });
              }

              const name = Array.from(individualElements).find(el => el.localName === "Name");
              if (!name) {
                errors.push({
                  message: `AccountReport ${index + 1}: Missing Name element in Individual`,
                  code: "50023",
                });
              }

              const address = Array.from(individualElements).find(el => el.localName === "Address");
              if (!address) {
                errors.push({
                  message: `AccountReport ${index + 1}: Missing Address element in Individual`,
                  code: "50024",
                });
              }
            }

            if (organisation) {
              const orgElements = organisation.getElementsByTagNameNS("*", "*");
              const resCountryCode = Array.from(orgElements).find(el => el.localName === "ResCountryCode");
              if (!resCountryCode || !resCountryCode.textContent?.trim()) {
                errors.push({
                  message: `AccountReport ${index + 1}: Missing or empty ResCountryCode in Organisation`,
                  code: "50025",
                });
              }

              const name = Array.from(orgElements).find(el => el.localName === "Name");
              if (!name || !name.textContent?.trim()) {
                errors.push({
                  message: `AccountReport ${index + 1}: Missing or empty Name in Organisation`,
                  code: "50026",
                });
              }

              const address = Array.from(orgElements).find(el => el.localName === "Address");
              if (!address) {
                errors.push({
                  message: `AccountReport ${index + 1}: Missing Address element in Organisation`,
                  code: "50027",
                });
              }
            }
          }

          const accountBalance = Array.from(reportElements).find(el => el.localName === "AccountBalance");
          if (!accountBalance || !accountBalance.textContent?.trim()) {
            errors.push({
              message: `AccountReport ${index + 1}: Missing or empty AccountBalance`,
              code: "50028",
            });
          } else {
            const currCode = accountBalance.getAttribute("currCode");
            if (!currCode || currCode.length !== 3) {
              errors.push({
                message: `AccountReport ${index + 1}: AccountBalance must have a 3-letter currCode attribute`,
                code: "50029",
              });
            }

            const amount = accountBalance.textContent?.trim();
            if (amount && !/^\d+(\.\d{1,2})?$/.test(amount)) {
              errors.push({
                message: `AccountReport ${index + 1}: AccountBalance must be numeric with maximum 2 decimal places`,
                code: "50030",
              });
            }
          }
        });
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
