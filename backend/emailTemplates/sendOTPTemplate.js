const sendOTPTemplate = (otp = null) => {
  if (!otp) {
    throw new Error("No OTP provided.");
  }

  let subject = "Alloy Vault Security Code: Your OTP for Verification";
  const intro = `
<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Alloy Vault OTP Confirmation</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #000;
                color: #fff;
                margin: 0;
                padding: 0;
            }
            h2, p {
            color: #fff;
            }
            .container {
                max-width: 600px;
                margin: 40px auto;
                background: #111;
                padding: 30px;
                border-radius: 12px;
                text-align: center;
                box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
            }
            .otp {
                font-size: 32px;
                font-weight: bold;
                color: #fff;
                background: #333;
                display: inline-block;
                padding: 10px 20px;
                border-radius: 8px;
                letter-spacing: 2px;
                margin: 20px 0;
            }
            .footer {
                margin-top: 30px;
                font-size: 14px;
                color: #bbb;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>OTP for Password Update</h2>
            <p>Your One-Time Password (OTP) for updating your password in Alloy Vault is:</p>
            <p class="otp">${otp}</p>
            <p>Please use this OTP to complete the process. The OTP is valid for 10 minutes.</p>
            <p class="footer">If you did not request this, please ignore this email or contact support.</p>
        </div>
    </body>
</html>`;

  return { subject, intro };
};

export default sendOTPTemplate;
