import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { DOMParser } from "npm:linkedom";

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
      const crsBody = doc.querySelector("CRS_OECD, MessageBody");
      if (!crsBody) {
        errors.push({
          message: "Missing required CRS_OECD or MessageBody root element (XSD Validation Rule 50002)",
          code: "50002",
        });
      }

      const messageSpec = doc.querySelector("MessageSpec");
      if (!messageSpec) {
        errors.push({
          message: "Missing required MessageSpec element (XSD Validation Rule 50003)",
          code: "50003",
        });
      } else {
        const sendingEntityIN = messageSpec.querySelector("SendingEntityIN");
        const transmittingCountry = messageSpec.querySelector("TransmittingCountry");
        const receivingCountry = messageSpec.querySelector("ReceivingCountry");
        const messageType = messageSpec.querySelector("MessageType");
        const messageRefId = messageSpec.querySelector("MessageRefId");
        const messageTypeIndic = messageSpec.querySelector("MessageTypeIndic");

        if (!sendingEntityIN || !sendingEntityIN.textContent?.trim()) {
          errors.push({
            message: "Missing or empty SendingEntityIN in MessageSpec (XSD Validation Rule 50004)",
            code: "50004",
          });
        }

        if (!transmittingCountry || !transmittingCountry.textContent?.trim()) {
          errors.push({
            message: "Missing or empty TransmittingCountry in MessageSpec (XSD Validation Rule 50006)",
            code: "50006",
          });
        } else {
          const country = transmittingCountry.textContent?.trim();
          if (country && country.length !== 2) {
            errors.push({
              message: `TransmittingCountry must be a 2-letter ISO country code, got: ${country} (XSD Validation Rule 50007)`,
              code: "50007",
            });
          }
        }

        if (!receivingCountry || !receivingCountry.textContent?.trim()) {
          errors.push({
            message: "Missing or empty ReceivingCountry in MessageSpec (XSD Validation Rule 50008)",
            code: "50008",
          });
        } else {
          const country = receivingCountry.textContent?.trim();
          if (country && country.length !== 2) {
            errors.push({
              message: `ReceivingCountry must be a 2-letter ISO country code, got: ${country} (XSD Validation Rule 50010)`,
              code: "50010",
            });
          }
        }

        if (!messageType || messageType.textContent?.trim() !== "CRS") {
          errors.push({
            message: "MessageType must be 'CRS' (XSD Validation Rule 50011)",
            code: "50011",
          });
        }

        if (!messageRefId || !messageRefId.textContent?.trim()) {
          errors.push({
            message: "Missing or empty MessageRefId in MessageSpec (XSD Validation Rule 50009)",
            code: "50009",
          });
        }

        if (!messageTypeIndic || !messageTypeIndic.textContent?.trim()) {
          errors.push({
            message: "Missing or empty MessageTypeIndic in MessageSpec (XSD Validation Rule 50013)",
            code: "50013",
          });
        } else {
          const validIndicators = ["OECD0", "OECD1", "OECD2", "OECD3", "OECD10", "OECD11", "OECD12", "OECD13"];
          const indic = messageTypeIndic.textContent?.trim();
          if (indic && !validIndicators.includes(indic)) {
            errors.push({
              message: `Invalid MessageTypeIndic value: ${indic}. Must be one of: ${validIndicators.join(", ")} (XSD Validation Rule 50014)`,
              code: "50014",
            });
          }
        }
      }

      const reportingPeriod = doc.querySelector("ReportingPeriod");
      if (!reportingPeriod || !reportingPeriod.textContent?.trim()) {
        errors.push({
          message: "Missing or empty ReportingPeriod (XSD Validation Rule 50015)",
          code: "50015",
        });
      } else {
        const period = reportingPeriod.textContent?.trim();
        if (period && !/^\d{4}-\d{2}-\d{2}$/.test(period)) {
          errors.push({
            message: `Invalid ReportingPeriod format: ${period}. Expected format: YYYY-MM-DD (XSD Validation Rule 50016)`,
            code: "50016",
          });
        }
      }

      const accountReports = doc.querySelectorAll("AccountReport");
      if (accountReports.length === 0) {
        errors.push({
          message: "No AccountReport elements found in XML (XSD Validation Rule 50017)",
          code: "50017",
        });
      } else {
        accountReports.forEach((report, index) => {
          const docRefId = report.querySelector("DocRefId");
          if (!docRefId || !docRefId.textContent?.trim()) {
            errors.push({
              message: `AccountReport ${index + 1}: Missing or empty DocRefId (XSD Validation Rule 50018)`,
              code: "50018",
            });
          }

          const accountNumber = report.querySelector("AccountNumber");
          if (!accountNumber || !accountNumber.textContent?.trim()) {
            errors.push({
              message: `AccountReport ${index + 1}: Missing or empty AccountNumber (XSD Validation Rule 50019)`,
              code: "50019",
            });
          }

          const accountHolder = report.querySelector("AccountHolder");
          if (!accountHolder) {
            errors.push({
              message: `AccountReport ${index + 1}: Missing AccountHolder element (XSD Validation Rule 50020)`,
              code: "50020",
            });
          } else {
            const individual = accountHolder.querySelector("Individual");
            const organisation = accountHolder.querySelector("Organisation");

            if (!individual && !organisation) {
              errors.push({
                message: `AccountReport ${index + 1}: AccountHolder must contain either Individual or Organisation (XSD Validation Rule 50021)`,
                code: "50021",
              });
            }

            if (individual) {
              const resCountryCode = individual.querySelector("ResCountryCode");
              if (!resCountryCode || !resCountryCode.textContent?.trim()) {
                errors.push({
                  message: `AccountReport ${index + 1}: Missing or empty ResCountryCode in Individual (XSD Validation Rule 50022)`,
                  code: "50022",
                });
              }

              const name = individual.querySelector("Name");
              if (!name) {
                errors.push({
                  message: `AccountReport ${index + 1}: Missing Name element in Individual (XSD Validation Rule 50023)`,
                  code: "50023",
                });
              }

              const address = individual.querySelector("Address");
              if (!address) {
                errors.push({
                  message: `AccountReport ${index + 1}: Missing Address element in Individual (XSD Validation Rule 50024)`,
                  code: "50024",
                });
              }
            }

            if (organisation) {
              const resCountryCode = organisation.querySelector("ResCountryCode");
              if (!resCountryCode || !resCountryCode.textContent?.trim()) {
                errors.push({
                  message: `AccountReport ${index + 1}: Missing or empty ResCountryCode in Organisation (XSD Validation Rule 50025)`,
                  code: "50025",
                });
              }

              const name = organisation.querySelector("Name");
              if (!name || !name.textContent?.trim()) {
                errors.push({
                  message: `AccountReport ${index + 1}: Missing or empty Name in Organisation (XSD Validation Rule 50026)`,
                  code: "50026",
                });
              }

              const address = organisation.querySelector("Address");
              if (!address) {
                errors.push({
                  message: `AccountReport ${index + 1}: Missing Address element in Organisation (XSD Validation Rule 50027)`,
                  code: "50027",
                });
              }
            }
          }

          const accountBalance = report.querySelector("AccountBalance");
          if (!accountBalance || !accountBalance.textContent?.trim()) {
            errors.push({
              message: `AccountReport ${index + 1}: Missing or empty AccountBalance (XSD Validation Rule 50028)`,
              code: "50028",
            });
          } else {
            const currCode = accountBalance.getAttribute("currCode");
            if (!currCode || currCode.length !== 3) {
              errors.push({
                message: `AccountReport ${index + 1}: AccountBalance must have a 3-letter currCode attribute (XSD Validation Rule 50029)`,
                code: "50029",
              });
            }

            const amount = accountBalance.textContent?.trim();
            if (amount && !/^\d+(\.\d{1,2})?$/.test(amount)) {
              errors.push({
                message: `AccountReport ${index + 1}: AccountBalance must be numeric with maximum 2 decimal places (XSD Validation Rule 50030)`,
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