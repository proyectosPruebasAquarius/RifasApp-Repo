(function() {
    'use strict';
    window.addEventListener('load', function() {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.getElementsByClassName('needs-validation');

        // Loop over them and prevent submission
        var validation = Array.prototype.filter.call(forms, function(form) {
            form.addEventListener('submit', function(event) {
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();

                }
                form.classList.add('was-validated');
            }, false);
        });
    }, false);
})();

function errorHandler(type, spanId, inputId, imgId) {
    let span = document.getElementById(spanId);
    let input = document.getElementById(inputId);
    let img = document.getElementById(imgId);
    //console.log(img);

    switch (type) {


        case 'sistema':
            if (input.id === 'nombre') {
                span.innerHTML = input.value.length + "/45";
                if (input.value.length === 0) {

                    input.classList.remove('is-valid');
                    input.classList.add('is-invalid');



                } else if (input.value.length > 0) {
                    input.classList.remove('is-invalid');

                    input.classList.add('is-valid');


                }
            }

            if (input.id === 'password') {
                span.innerHTML = input.value.length + "/500";
                if (input.value.length === 0) {

                    input.classList.remove('is-valid');
                    input.classList.add('is-invalid');



                } else if (input.value.length > 0) {
                    input.classList.remove('is-invalid');

                    input.classList.add('is-valid');


                }
            }

            if (input.id === 'empleado' || input.id === 'tipo') {
                if (input.value.length === 0) {
                    span.classList.remove('border__select__success');
                    input.classList.remove('is-valid');
                    input.classList.add('is-invalid');
                    span.classList.add('border__select__error');


                } else if (input.value.length > 0) {
                    input.classList.remove('is-invalid');
                    span.classList.remove('border__select__error');
                    span.classList.add('border__select__success');
                    input.classList.add('is-valid');


                }
            }

            break;




        case 'clientes':



            if (input.id === 'dui') {
                // Creando Regex Ruler
                let regex = new RegExp("^[0-9 \-]+$");
                // Agregando GUIÓN automatico
                let addHyphen = input.value.split('-').join('');
                // Comprobando que el match no sea null
                if (addHyphen.match(/.{1,8}/g) != null) {
                    let finalVal = addHyphen.match(/.{1,8}/g).join('-');
                    input.value = finalVal;
                }
                // Condiciones para ser valido
                if (input.value.length >= 0 && input.value.length == 10 && regex.test(input.value)) {
                    input.classList.remove('is-invalid');
                    input.classList.add('is-valid');
                    span.innerHTML = '';
                    span.style.color = '';
                } else {
                    input.classList.remove('is-valid');
                    input.classList.add('is-invalid');
                    span.style.color = '#dc3545';
                    span.innerHTML = !regex.test(input.value) ? 'Porfavor Ingrese Un Número De DUI Válido' : 'Este Campo Es Obligatorio'
                }
            }

            if (input.id === 'nombres') {
                span.innerHTML = input.value.length + "/45";
                if (input.value.length === 0) {

                    input.classList.remove('is-valid');
                    input.classList.add('is-invalid');



                } else if (input.value.length > 0) {
                    input.classList.remove('is-invalid');

                    input.classList.add('is-valid');


                }
            }
            if (input.id === 'apellidos') {
                span.innerHTML = input.value.length + "/45";
                if (input.value.length === 0) {
                    input.classList.remove('is-valid');
                    input.classList.add('is-invalid');

                } else if (input.value.length > 0) {
                    input.classList.remove('is-invalid');
                    input.classList.add('is-valid');
                }
            }
            if (input.id === 'celular') {
                span.innerHTML = input.value.length + "/8";

                let regexN = new RegExp("^[0-9]+$");
                if (input.value.length >= 8 && input.value.length <= 12 && regexN.test(input.value)) {
                    input.classList.remove('is-invalid');
                    span.style.color = '';
                    input.classList.add('is-valid');
                } else {
                    input.classList.remove('is-valid');
                    input.classList.add('is-invalid');
                    //span.style.color = '#dc3545';
                    span.innerHTML = 'Porfavor Ingrese Un Número De Celular Válido'
                }

            }
            if (input.id === 'correo') {
                span.innerHTML = input.value.length + "/50";
                const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                if (input.value.length > 5 && re.test(String(input.value).toLowerCase())) {
                    span.style.color = '';
                    input.classList.remove('is-invalid');
                    input.classList.add('is-valid');

                } else {

                    input.classList.remove('is-valid');
                    input.classList.add('is-invalid');
                    span.style.color = '#dc3545';
                    span.innerHTML = 'Porfavor Ingrese Un Email Válido'
                }

            }
            break;




        case 'boletos':
            if (input.id === 'rifa') {
                if (input.value.length === 0) {
                    span.classList.remove('border__select__success');
                    input.classList.remove('is-valid');
                    input.classList.add('is-invalid');
                    span.classList.add('border__select__error');


                } else if (input.value.length > 0) {
                    input.classList.remove('is-invalid');
                    span.classList.remove('border__select__error');
                    span.classList.add('border__select__success');
                    input.classList.add('is-valid');


                }
            }


            if (input.value.length === 0) {
                input.classList.remove('is-valid');
                input.classList.add('is-invalid');
                input.focus();

            } else if (input.value.length > 0) {
                input.classList.remove('is-invalid');
                input.classList.add('is-valid');

            }

            break;
        case 'inventarios':
            if (input.id === 'producto' || input.id === 'proveedor') {
                if (input.value.length === 0) {
                    span.classList.remove('border__select__success');
                    input.classList.remove('is-valid');
                    input.classList.add('is-invalid');
                    span.classList.add('border__select__error');


                } else if (input.value.length > 0) {
                    input.classList.remove('is-invalid');
                    span.classList.remove('border__select__error');
                    span.classList.add('border__select__success');
                    input.classList.add('is-valid');


                }
            }
            if (input.id === 'observacion') {
                span.innerHTML = input.value.length + "/45";
            }

            if (input.value.length === 0) {
                input.classList.remove('is-valid');
                input.classList.add('is-invalid');
                input.focus();

            } else if (input.value.length > 0) {
                input.classList.remove('is-invalid');
                input.classList.add('is-valid');

            }

            break;

        case 'publicaciones':
            if (input.id === 'rifas') {
                if (input.value.length === 0) {
                    span.classList.remove('border__select__success');
                    input.classList.remove('is-valid');
                    input.classList.add('is-invalid');
                    span.classList.add('border__select__error');


                } else if (input.value.length > 0) {
                    input.classList.remove('is-invalid');
                    span.classList.remove('border__select__error');
                    span.classList.add('border__select__success');
                    input.classList.add('is-valid');


                }
            }

            if (input.value.length === 0) {
                input.classList.remove('is-valid');
                input.classList.add('is-invalid');
                input.focus();

            } else if (input.value.length > 0) {
                input.classList.remove('is-invalid');
                input.classList.add('is-valid');

            }

            break;
        case 'cargos':
            if (input.id === 'nombre') {
                span.innerHTML = input.value.length + "/45";
            }

            if (input.value.length === 0) {
                input.classList.remove('is-valid');
                input.classList.add('is-invalid');


            } else if (input.value.length > 0) {
                input.classList.remove('is-invalid');
                input.classList.add('is-valid');

            }

            break;

        case 'rifas':

            if (input.id === 'productos') {

                if (input.value.length === 0) {
                    span.classList.remove('border__select__success');
                    input.classList.remove('is-valid');
                    input.classList.add('is-invalid');
                    span.classList.add('border__select__error');


                } else if (input.value.length > 0) {
                    input.classList.remove('is-invalid');
                    span.classList.remove('border__select__error');
                    span.classList.add('border__select__success');
                    input.classList.add('is-valid');


                }
            }
            if (input.value.length === 0) {
                input.classList.remove('is-valid');
                input.classList.add('is-invalid');
                input.focus();

            } else if (input.value.length > 0) {
                input.classList.remove('is-invalid');
                input.classList.add('is-valid');

            }

            break;
        case 'proveedores':

            if (input.id === 'municipio') {

                if (input.value.length === 0) {
                    span.classList.remove('border__select__success');
                    input.classList.remove('is-valid');
                    input.classList.add('is-invalid');
                    span.classList.add('border__select__error');


                } else if (input.value.length > 0) {
                    input.classList.remove('is-invalid');
                    span.classList.remove('border__select__error');
                    span.classList.add('border__select__success');
                    input.classList.add('is-valid');


                }
            }
            if (input.value.length === 0) {
                input.classList.remove('is-valid');
                input.classList.add('is-invalid');
                input.focus();

            } else if (input.value.length > 0) {
                input.classList.remove('is-invalid');
                input.classList.add('is-valid');

            }

            break;

        case 'roles':

            span.innerHTML = input.value.length + "/45";
            if (input.value.length === 0) {
                input.classList.remove('is-valid');
                input.classList.add('is-invalid');
                input.focus();

            } else if (input.value.length > 0) {
                input.classList.remove('is-invalid');
                input.classList.add('is-valid');

            }

            break;
        case 'rolesE':


            if (input.value.length === 0) {
                input.classList.remove('is-valid');
                span.classList.remove('border__select__success');
                input.classList.add('is-invalid');
                span.classList.add('border__select__error');
                input.focus();

            } else if (input.value.length > 0) {
                input.classList.remove('is-invalid');
                span.classList.remove('border__select__error');
                span.classList.add('border__select__success');
                input.classList.add('is-valid');

            }

            break;
        case 'marcas':

            span.innerHTML = input.value.length + "/150";
            if (input.value.length === 0) {
                input.classList.remove('is-valid');
                input.classList.add('is-invalid');
                input.focus();

            } else if (input.value.length > 0) {
                input.classList.remove('is-invalid');
                input.classList.add('is-valid');

            }

            break;
        case 'sucursales':

            if (input.id === 'nombre') {
                span.innerHTML = input.value.length + "/50";
                if (input.value.length === 0) {
                    input.classList.remove('is-valid');
                    input.classList.add('is-invalid');
                    input.focus();

                } else if (input.value.length > 0) {
                    input.classList.remove('is-invalid');
                    input.classList.add('is-valid');

                }
            } else if (input.id === 'telefono') {
                span.innerHTML = input.value.length + "/14";
                if (input.value.length === 0) {
                    input.classList.remove('is-valid');
                    input.classList.add('is-invalid');
                    input.focus();

                } else if (input.value.length > 0) {
                    input.classList.remove('is-invalid');
                    input.classList.add('is-valid');

                }
            } else if (input.id === 'direccion') {
                span.innerHTML = input.value.length + "/200";
                if (input.value.length === 0) {
                    input.classList.remove('is-valid');
                    input.classList.add('is-invalid');
                    input.focus();

                } else if (input.value.length > 0) {
                    input.classList.remove('is-invalid');
                    input.classList.add('is-valid');

                }
            } else if (input.id === 'municipio') {

                if (input.value.length === 0) {

                    span.classList.remove('border__select__success');
                    input.classList.remove('is-valid');
                    input.classList.add('is-invalid');
                    input.focus();

                } else if (input.value.length > 0) {

                    span.classList.remove('border__select__success');
                    input.classList.remove('is-invalid');

                    span.classList.add('border__select__success');
                    input.classList.add('is-valid');

                }
            }



            break;
        case 'categorias':
            if (input.id === "nombre") {
                span.innerHTML = input.value.length + "/45";
                if (input.value === null) {
                    input.classList.remove('is-valid');
                    input.classList.add('is-invalid');


                } else if (input.value.length > 0) {
                    input.classList.remove('is-invalid');
                    input.classList.add('is-valid');
                }
            } else if (input.id === "descripcion") {
                span.innerHTML = input.value.length + "/200";
                if (input.value.length === 0) {
                    input.classList.remove('is-valid');
                    input.classList.add('is-invalid');


                } else if (input.value.length > 0) {
                    input.classList.remove('is-invalid');
                    input.classList.add('is-valid');
                }
            }
            break;
        case 'productos':

            if (input.id === "nombre") {
                span.innerHTML = input.value.length + "/45";
                if (input.value === null) {
                    input.classList.remove('is-valid');
                    input.classList.add('is-invalid');


                } else if (input.value.length > 0) {
                    input.classList.remove('is-invalid');
                    input.classList.add('is-valid');
                }
            } else if (input.id === "descripcion") {
                span.innerHTML = input.value.length + "/300";
                if (input.value.length === 0) {
                    input.classList.remove('is-valid');
                    input.classList.add('is-invalid');


                } else if (input.value.length > 0) {
                    input.classList.remove('is-invalid');
                    input.classList.add('is-valid');
                }
            } else if (input.id === "url") {
                span.innerHTML = input.value.length + "/200";
                if (input.value.length === 0) {
                    input.classList.remove('is-valid');
                    input.classList.add('is-invalid');


                } else if (input.value.length > 0) {
                    input.classList.remove('is-invalid');
                    input.classList.add('is-valid');
                }
            } else if (input.id === 'marca' || input.id === 'categoria') {
                if (input.value.length === 0) {
                    span.classList.remove('border__select__success');
                    span.classList.add('border__select__error');
                    input.classList.remove('is-valid');
                    input.classList.add('is-invalid');


                } else if (input.value.length > 0) {
                    span.classList.remove('border__select__error');
                    input.classList.remove('is-invalid');
                    input.classList.add('is-valid');
                    span.classList.add('border__select__success');

                }
            } else if (input.id === 'imagen') {
                if (input.value.length === 0) {
                    span.classList.remove('border__select__success');
                    span.classList.add('border__select__error');

                } else if (input.value.length > 0) {
                    span.classList.remove('border__select__error');
                    span.classList.add('border__select__success');
                    let imgValue = input.value,
                        idxDot = imgValue.lastIndexOf(".") + 1,
                        extFile = imgValue.substr(idxDot, imgValue.length).toLowerCase();
                    if (extFile == "jpg" || extFile == "jpeg" || extFile == "png") {
                        input.classList.remove('is-invalid');
                        span.classList.remove('border__select__error');
                        span.classList.add('border__select__success');
                    } else {

                        input.classList.add('is-invalid');
                        span.classList.remove('border__select__success');
                        span.classList.add('border__select__error');
                        img.innerHTML = "Solo los formatos jpg/jpeg y png son permitidos"
                    }
                }
            }



            break;

        case 'texto':
            if (input.value == '' || input.value == null) {
                input.classList.remove('is-valid');
                input.classList.add('is-invalid');
                span.style.color = '#dc3545';
                span.innerHTML = 'Este Campo Es Obligatorio'
            } else if (input.value.length <= 3) {
                input.classList.remove('is-valid');
                input.classList.add('is-invalid');
                span.style.color = '#dc3545';
                span.innerHTML = 'Ingrese Más De 3 Digitos'
            } else if (input.value.length > 50) {
                input.classList.remove('is-valid');
                input.classList.add('is-invalid');
                span.style.color = '#dc3545';
                span.innerHTML = 'Ingrese Menos De 50 Digitos'
            } else {
                // span.style.color = 'green';
                input.classList.remove('is-invalid');
                input.classList.add('is-valid');
                span.innerHTML = '';
                //callback(formId);
            }
            break;
        case 'dui':
            // Creando Regex Ruler
            let regex = new RegExp("^[0-9 \-]+$");
            // Agregando GUIÓN automatico
            let addHyphen = input.value.split('-').join('');
            // Comprobando que el match no sea null
            if (addHyphen.match(/.{1,8}/g) != null) {
                let finalVal = addHyphen.match(/.{1,8}/g).join('-');
                input.value = finalVal;
            }
            // Condiciones para ser valido
            if (input.value.length >= 0 && input.value.length == 10 && regex.test(input.value)) {
                input.classList.remove('is-invalid');
                input.classList.add('is-valid');
                span.innerHTML = '';
            } else {
                input.classList.remove('is-valid');
                input.classList.add('is-invalid');
                span.style.color = '#dc3545';
                span.innerHTML = !regex.test(input.value) ? 'Porfavor Ingrese Un Número De DUI Válido' : 'Este Campo Es Obligatorio'
            }
            break;
        case 'number':
            // Creando Regex Ruler
            let regexN = new RegExp("^[0-9]+$");
            if (input.value.length >= 8 && input.value.length <= 12 && regexN.test(input.value)) {
                input.classList.remove('is-invalid');
                input.classList.add('is-valid');
                span.innerHTML = '';
            } else {
                //input.style.borderBottomColor = '#dc3545'
                input.classList.remove('is-valid');
                input.classList.add('is-invalid');
                span.style.color = '#dc3545';
                span.innerHTML = inputId == 'telefono' ? 'Porfavor Ingrese Un Número De Teléfono Válido' : 'Porfavor Ingrese Un Número De Celular Válido'
            }
            break;
        case 'email':
            const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            if (input.value.length > 5 && re.test(String(input.value).toLowerCase())) {
                input.classList.remove('is-invalid');
                input.classList.add('is-valid');
                span.innerHTML = '';
            } else {
                //input.style.borderBottomColor = '#dc3545'
                input.classList.remove('is-valid');
                input.classList.add('is-invalid');
                span.style.color = '#dc3545';
                span.innerHTML = input.value == '' ? 'Este Campo Es Obligatorio' : 'Porfavor Ingrese Un Email Válido'
            }
            break;
        case 'select':
            console.log(inputId)
                /*$(document).ready(function() {
                    if ($('#'+inputId).val() != '') {                    
                        input.classList.add('has__error');
                        span.style.color = '#dc3545';
                        span.innerHTML = 'Porfavor Ingrese Un Número De Celular Válido'
                    } else {
                        span.style.color = '#dc3545';
                        span.innerHTML = 'Por'
                    }
                          
                })*/
                /*if (inputId.length > 0) {
                    input.classList.add('has__error');
                    span.style.color = '#dc3545';
                    span.innerHTML = 'Porfavor Ingrese Un Número De Celular Válido'
                }*/
            if (inputId.length > 0) {
                input.classList.remove('is-invalid');
                input.classList.add('is-valid');
                span.innerHTML = '';
            } else {
                input.classList.remove('is-valid');
                input.classList.add('is-invalid');
                span.style.color = '#dc3545';
                span.innerHTML = 'Este Campo Es Obligatorio'
            }
            break;
        case 'select2':
            //console.log(inputId)
            /*$(document).ready(function() {
                if ($('#'+inputId).val() != '') {                    
                    input.classList.add('has__error');
                    span.style.color = '#dc3545';
                    span.innerHTML = 'Porfavor Ingrese Un Número De Celular Válido'
                } else {
                    span.style.color = '#dc3545';
                    span.innerHTML = 'Por'
                }
                      
            })*/
            /*if (inputId.length > 0) {
                input.classList.add('has__error');
                span.style.color = '#dc3545';
                span.innerHTML = 'Porfavor Ingrese Un Número De Celular Válido'
            }*/
            if (inputId.length > 0) {
                //span.classList.remove('is-invalid');
                span.classList.add('border__select__success');
                // span.innerHTML = '';
            }
            break;
        case 'image':
            let imgValue = input.value,
                idxDot = imgValue.lastIndexOf(".") + 1,
                extFile = imgValue.substr(idxDot, imgValue.length).toLowerCase();
            if (extFile == "jpg" || extFile == "jpeg" || extFile == "png") {
                input.classList.remove('is-invalid');
                input.classList.add('is-valid');
                span.innerHTML = '';
            } else {
                input.classList.remove('is-valid');
                input.classList.add('is-invalid');
                span.style.color = '#dc3545';
                span.innerHTML = extFile != "jpg" || extFile != "jpeg" || extFile != "png" ? 'Solo jpg/jpeg y png son permitidos' : 'Este Campo Es Obligatorio'
            }
            break;
        case 'dropdown':
            console.log(inputId)
            if (input.options[input.selectedIndex].value != '' || input.options[input.selectedIndex].value != null) {
                input.classList.remove('is-invalid');
                input.classList.add('is-valid');
                span.innerHTML = '';
            } else {
                input.classList.remove('is-valid');
                input.classList.add('is-invalid');
                span.style.color = '#dc3545';
                span.innerHTML = 'Este Campo Es Obligatorio'
            }
            break;
        case 'nit':
            let regx = new RegExp("^[0-9 \-]+$");
            if (input.value.length == 17 && regx.test(input.value)) {
                input.classList.remove('is-invalid');
                input.classList.add('is-valid');
                span.innerHTML = '';
            } else {
                input.classList.remove('is-valid');
                input.classList.add('is-invalid');
                span.style.color = '#dc3545';
                span.innerHTML = !regx.test(input.value) ? 'Porfavor Ingrese Un Número De NIT Válido' : 'Este Campo Es Obligatorio'
            }
            break;
        case 'seguro':
            let regxS = new RegExp("^[0-9]+$");
            if (input.value.length == 9 && regxS.test(input.value)) {
                input.classList.remove('is-invalid');
                input.classList.add('is-valid');
                span.innerHTML = '';
            } else {
                input.classList.remove('is-valid');
                input.classList.add('is-invalid');
                span.style.color = '#dc3545';
                span.innerHTML = !regxS.test(input.value) ? 'Porfavor Ingrese Un Número De Seguro Válido' : 'Este Campo Es Obligatorio'
            }
            break;
        case 'afp':
            let regAfp = new RegExp("^[0-9]+$");
            if (input.value.length == 12 && regAfp.test(input.value)) {
                input.classList.remove('is-invalid');
                input.classList.add('is-valid');
                span.innerHTML = '';
            } else {
                input.classList.remove('is-valid');
                input.classList.add('is-invalid');
                span.style.color = '#dc3545';
                span.innerHTML = !regAfp.test(input.value) ? 'Porfavor Ingrese Un Número De AFP Válido' : 'Este Campo Es Obligatorio'
            }
            break;
        case 'cuenta':
            let regxC = new RegExp("^[0-9 \-]+$");
            if (input.value.length > 10 && input.value.length <= 20 && regxC.test(input.value)) {
                input.classList.remove('is-invalid');
                input.classList.add('is-valid');
                span.innerHTML = '';
            } else {
                input.classList.remove('is-valid');
                input.classList.add('is-invalid');
                span.style.color = '#dc3545';
                span.innerHTML = !regxC.test(input.value) ? 'Porfavor Ingrese Un Número De Cuenta Válido' : 'Este Campo Es Obligatorio'
            }
            break;
        default:

            break;
    }
}