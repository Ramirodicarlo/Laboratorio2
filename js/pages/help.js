function sendEmail(){

    nombre = document.getElementById("name").value;
    msj = document.getElementById("msj").value;
    correo = document.getElementById("email").value

    var templateParams = {
        name: nombre,
        email: correo,
        notes: msj
    };
    
    emailjs.send('service_8l6r60e', 'contact_form', templateParams)
        .then(function(response) {
        console.log('SUCCESS!', response.status, response.text);
        let msj = document.getElementById("sec-cine-result");
        msj.innerHTML = '<p class="verde">¡Email enviado con éxito!</p>';
        }, function(error) {
        console.log('FAILED...', error);
        let msj = document.getElementById("sec-cine-result");
        msj.innerHTML = '<p class="rojo">Hubo un error al enviar el email. Por favor, inténtalo nuevamente más tarde.</p>';
        }
        );
}
function limpiar(){
    document.getElementById("emailForm").reset();
}
