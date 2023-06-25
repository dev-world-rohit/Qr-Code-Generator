document.getElementById("qr-form").addEventListener("submit", function (event) {
    event.preventDefault();
    var generateBtn = document.getElementById("generate-btn");
    var display_div = document.getElementById("loader");
    display_div.style.display = "block"; 
    generateBtn.disabled = true;
    var form = event.target;
    var url = form.elements["url"].value;
    var boxSize = form.elements["box_size"].value;
    var borderSize = form.elements["border_size"].value;
    var foregroundColor = form.elements["foreground_color"].value;
    var backgroundColor = form.elements["background_color"].value;

    // Convert hexadecimal color codes to RGB values
    var foregroundRGB = hexToRGB(foregroundColor);
    var backgroundRGB = hexToRGB(backgroundColor);

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            generateBtn.disabled = false;
            display_div.style.display = "none";
            if (xhr.status === 200) {
                var reader = new FileReader();
                reader.onloadend = function () {
                    var qrCodeContainer =
                        document.getElementById("qr-code-container");
                    qrCodeContainer.innerHTML = `
                                <img src="${reader.result}" id="qr-code-img" alt="QR Code" style="width:100%;">
                            `;
                    var downloadBtn = document.getElementById("download-btn");
                    downloadBtn.style.display = "block";
                    downloadBtn.href = reader.result;
                    downloadBtn.download = "qr_code.png";
                };
                reader.readAsDataURL(
                    new Blob([xhr.response], { type: "image/png" })
                );
            } else {
                var errorMessageContainer =
                    document.getElementById("error-message");
                errorMessageContainer.textContent =
                    "Error: " + xhr.responseText;
                errorMessageContainer.style.display = "block";
            }
        }
    };
    xhr.open("POST", "/generate_qr_code", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.responseType = "arraybuffer";
    xhr.send(
        JSON.stringify({
            url: url,
            box_size: boxSize,
            border_size: borderSize,
            foreground_color: foregroundRGB,
            background_color: backgroundRGB,
        })
    );
});

function hexToRGB(hex) {
    hex = hex.replace("#", "");
    var r = parseInt(hex.substring(0, 2), 16);
    var g = parseInt(hex.substring(2, 4), 16);
    var b = parseInt(hex.substring(4, 6), 16);
    return [r, g, b];
}

function downloadQRCode() {
    var qrCodeImg = document.getElementById("qr-code-img");
    var downloadLink = document.createElement("a");
    downloadLink.href = qrCodeImg.src;
    downloadLink.download = "qrcode.png";
    downloadLink.click();
}