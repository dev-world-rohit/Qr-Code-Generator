from flask import Flask, render_template, request, jsonify
import qrcode
from io import BytesIO

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/generate_qr_code', methods=['POST'])
def generate_qr_code():
    try:
        data = request.get_json()
        url = data['url']
        box_size = int(data['box_size'])
        border_size = int(data['border_size'])
        foreground_rgb = tuple(data['foreground_color'])
        background_rgb = tuple(data['background_color'])


        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=box_size,
            border=border_size
        )
        qr.add_data(url)
        qr.make(fit=True)

        

        qr_image = qr.make_image(
            back_color= background_rgb,
            fill_color= foreground_rgb            
        )

        qr_image_io = BytesIO()
        qr_image.save(qr_image_io, 'PNG')
        qr_image_io.seek(0)

        return qr_image_io.getvalue()

    except Exception as e:
        print(f"Error generating QR code: {str(e)}")
        return jsonify(error=str(e)), 500


if __name__ == '__main__':
    app.run(debug=True)