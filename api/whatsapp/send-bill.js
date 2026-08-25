// ============================================================
// WOOD SHOP
// VERCEL WHATSAPP BILL API
// ============================================================
//
// Endpoint:
//
// POST /api/whatsapp/send-bill
//
// Receives:
//
// {
//     pdfBase64,
//     fileName,
//     customerName,
//     mobile
// }
//
// Then:
//
// PDF
//   ↓
// Meta WhatsApp Media
//   ↓
// WhatsApp Template
//   ↓
// Customer
// ============================================================


export default async function handler(req, res) {

    // ========================================================
    // CORS
    // ========================================================

    res.setHeader(
        "Access-Control-Allow-Origin",
        "*"
    );

    res.setHeader(
        "Access-Control-Allow-Methods",
        "POST, OPTIONS"
    );

    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type"
    );


    // ========================================================
    // OPTIONS
    // ========================================================

    if (
        req.method === "OPTIONS"
    ) {

        return res.status(200).json({

            success: true

        });

    }


    // ========================================================
    // ONLY POST
    // ========================================================

    if (
        req.method !== "POST"
    ) {

        return res.status(405).json({

            success: false,

            code:
                "METHOD_NOT_ALLOWED",

            message:
                "Only POST requests are allowed."

        });

    }


    try {

        console.log(
            "======================================"
        );

        console.log(
            "WHATSAPP BILL API STARTED"
        );

        console.log(
            "======================================"
        );


        // ====================================================
        // READ REQUEST BODY
        // ====================================================

        let body =
            req.body;


        // Vercel can sometimes provide
        // body as a string.

        if (
            typeof body === "string"
        ) {

            try {

                body =
                    JSON.parse(
                        body
                    );

            }
            catch (
                parseError
            ) {

                return res.status(400).json({

                    success: false,

                    code:
                        "INVALID_JSON",

                    message:
                        "Invalid request data."

                });

            }

        }


        body =
            body || {};


        // ====================================================
        // GET VALUES
        // ====================================================

        const pdfBase64 =
            body.pdfBase64 ||
            "";

        const fileName =
            body.fileName ||
            "Wood_Bill.pdf";

        const customerName =
            String(
                body.customerName ||
                ""
            ).trim();


        let mobile =
            String(
                body.mobile ||
                ""
            )
            .replace(
                /\D/g,
                ""
            );


        // ====================================================
        // REMOVE INDIA PREFIX
        // ====================================================

        if (
            mobile.length === 12 &&
            mobile.startsWith("91")
        ) {

            mobile =
                mobile.substring(2);

        }


        console.log(
            "CUSTOMER:",
            customerName
        );

        console.log(
            "MOBILE:",
            mobile
        );

        console.log(
            "PDF BASE64 LENGTH:",
            pdfBase64.length
        );


        // ====================================================
        // VALIDATE CUSTOMER NAME
        // ====================================================

        if (
            !customerName
        ) {

            return res.status(400).json({

                success: false,

                code:
                    "CUSTOMER_NAME_MISSING",

                message:
                    "Customer name is missing."

            });

        }


        // ====================================================
        // VALIDATE MOBILE
        // ========================================================

        if (
            mobile.length !== 10
        ) {

            return res.status(400).json({

                success: false,

                code:
                    "INVALID_MOBILE",

                message:
                    "Customer mobile number is invalid."

            });

        }


        // ====================================================
        // VALIDATE PDF
        // ========================================================

        if (
            !pdfBase64
        ) {

            return res.status(400).json({

                success: false,

                code:
                    "PDF_MISSING",

                message:
                    "Bill PDF is missing."

            });

        }


        // ====================================================
        // GET ENV VARIABLES
        // ========================================================

        const accessToken =
            process.env.WHATSAPP_ACCESS_TOKEN;

        const phoneNumberId =
            process.env.WHATSAPP_PHONE_NUMBER_ID;

        const apiVersion =
            process.env.WHATSAPP_API_VERSION ||
            "v23.0";

        const templateName =
            process.env.WHATSAPP_BILL_TEMPLATE ||
            "bill_receipt";

        const templateLanguage =
            process.env.WHATSAPP_TEMPLATE_LANGUAGE ||
            "en_US";


        // ====================================================
        // CHECK CONFIG
        // ====================================================

        if (
            !accessToken
        ) {

            console.error(
                "WHATSAPP_ACCESS_TOKEN IS MISSING"
            );

            return res.status(500).json({

                success: false,

                code:
                    "ACCESS_TOKEN_MISSING",

                message:
                    "WhatsApp access token is not configured."

            });

        }


        if (
            !phoneNumberId
        ) {

            console.error(
                "WHATSAPP_PHONE_NUMBER_ID IS MISSING"
            );

            return res.status(500).json({

                success: false,

                code:
                    "PHONE_NUMBER_ID_MISSING",

                message:
                    "WhatsApp phone number ID is not configured."

            });

        }


        // ====================================================
        // REMOVE DATA URL PREFIX
        // ====================================================

        let cleanBase64 =
            pdfBase64;


        if (
            cleanBase64.includes(
                "base64,"
            )
        ) {

            cleanBase64 =
                cleanBase64.split(
                    "base64,"
                )[1];

        }


        // ====================================================
        // CONVERT BASE64 → BUFFER
        // ====================================================

        const pdfBuffer =
            Buffer.from(
                cleanBase64,
                "base64"
            );


        console.log(
            "PDF BUFFER SIZE:",
            pdfBuffer.length
        );


        // ====================================================
        // CHECK PDF
        // ====================================================

        if (
            pdfBuffer.length < 100
        ) {

            return res.status(400).json({

                success: false,

                code:
                    "INVALID_PDF",

                message:
                    "Generated PDF is empty or invalid."

            });

        }


        // ====================================================
        // CREATE FORM DATA FOR META
        // ====================================================

        const uploadForm =
            new FormData();


        uploadForm.append(
            "messaging_product",
            "whatsapp"
        );


        uploadForm.append(
            "file",
            new Blob(
                [
                    pdfBuffer
                ],
                {
                    type:
                        "application/pdf"
                }
            ),
            fileName
        );


        // ====================================================
        // UPLOAD PDF TO WHATSAPP
        // ====================================================

        console.log(
            "Uploading PDF to Meta..."
        );


        const uploadResponse =
            await fetch(
                `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/media`,
                {

                    method:
                        "POST",

                    headers: {

                        Authorization:
                            `Bearer ${accessToken}`

                    },

                    body:
                        uploadForm

                }
            );


        const uploadData =
            await uploadResponse.json();


        console.log(
            "META MEDIA RESPONSE:",
            uploadData
        );


        // ====================================================
        // MEDIA UPLOAD ERROR
        // ====================================================

        if (
            !uploadResponse.ok ||
            !uploadData.id
        ) {

            return res.status(502).json({

                success: false,

                code:
                    "MEDIA_UPLOAD_FAILED",

                message:
                    uploadData?.error?.message ||
                    "Unable to upload the bill PDF to WhatsApp.",

                meta:
                    uploadData

            });

        }


        const mediaId =
            uploadData.id;


        console.log(
            "MEDIA ID:",
            mediaId
        );


        // ====================================================
        // CUSTOMER WHATSAPP NUMBER
        // ====================================================

        const whatsappNumber =
            "91" + mobile;


        // ====================================================
        // WHATSAPP TEMPLATE MESSAGE
        // ====================================================

        const messagePayload = {

            messaging_product:
                "whatsapp",

            recipient_type:
                "individual",

            to:
                whatsappNumber,

            type:
                "template",

            template: {

                name:
                    templateName,

                language: {

                    code:
                        templateLanguage

                },

                components: [

                    // ========================================
                    // PDF HEADER
                    // ========================================

                    {

                        type:
                            "header",

                        parameters: [

                            {

                                type:
                                    "document",

                                document: {

                                    id:
                                        mediaId,

                                    filename:
                                        fileName

                                }

                            }

                        ]

                    },


                    // ========================================
                    // CUSTOMER NAME
                    // ========================================

                    {

                        type:
                            "body",

                        parameters: [

                            {

                                type:
                                    "text",

                                text:
                                    customerName

                            }

                        ]

                    }

                ]

            }

        };


        console.log(
            "SENDING WHATSAPP MESSAGE..."
        );


        console.log(
            JSON.stringify(
                messagePayload,
                null,
                2
            )
        );


        // ====================================================
        // SEND MESSAGE
        // ====================================================

        const messageResponse =
            await fetch(
                `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`,
                {

                    method:
                        "POST",

                    headers: {

                        Authorization:
                            `Bearer ${accessToken}`,

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            messagePayload
                        )

                }
            );


        const messageData =
            await messageResponse.json();


        console.log(
            "META MESSAGE RESPONSE:",
            messageData
        );


        // ====================================================
        // META ERROR
        // ====================================================

        if (
            !messageResponse.ok ||
            messageData.error
        ) {

            console.error(
                "WHATSAPP SEND ERROR:",
                messageData
            );


            return res.status(502).json({

                success: false,

                code:
                    "WHATSAPP_SEND_FAILED",

                message:
                    messageData?.error?.message ||
                    "WhatsApp could not send the bill.",

                meta:
                    messageData

            });

        }


        // ====================================================
        // MESSAGE ID
        // ====================================================

        const messageId =
            messageData
                ?.messages?.[0]?.id ||
            null;


        // ====================================================
        // SUCCESS
        // ====================================================

        console.log(
            "======================================"
        );

        console.log(
            "WHATSAPP BILL SENT SUCCESSFULLY"
        );

        console.log(
            "MESSAGE ID:",
            messageId
        );

        console.log(
            "======================================"
        );


        return res.status(200).json({

            success: true,

            code:
                "SENT",

            message:
                "Bill sent successfully through WhatsApp.",

            messageId:
                messageId

        });


    }
    catch (
        error
    ) {

        console.error(
            "======================================"
        );

        console.error(
            "WHATSAPP API ERROR"
        );

        console.error(
            error
        );

        console.error(
            "======================================"
        );


        return res.status(500).json({

            success: false,

            code:
                "SERVER_ERROR",

            message:
                error.message ||
                "WhatsApp server error."

        });

    }

}
