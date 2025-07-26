//variables globales
const d = document;
let clienteInpu = d.querySelector(".cliente");
let productoInput = d.querySelector(".producto");
let precioInput = d.querySelector(".precio");
let imagenInput = d.querySelector(".imagen");
let observacionInput = d.querySelector(".observacion");
let btnGuardar = d.querySelector(".btn-guardar");
let tabla = d.querySelector(".table > tbody");

//agregar evento click al boton del formulario
btnGuardar.addEventListener("click", ()=> {
    // alert(clienteInpu.value);
    let datos = validarFormulario();
    if(datos != null){
    guardarDatos(datos);
    }
    borrarTabla();
    mostrarDatos();
});

//funcion para validar campos del formulario
function validarFormulario(){
    let datosForm;
    if(clienteInpu.value == "" || productoInput.value == "" || precioInput.value == "" || imagenInput.value == ""){
        alert("Todos los campos del formulario son obligatorios.");
        
    }else{
        datosForm = {
            cliente: clienteInpu.value,
            producto: productoInput.value,
            precio: precioInput.value,
            imagen: imagenInput.value,
            observacion: observacionInput.value
        }
    }
    console.log(datosForm);
    clienteInpu.value = "";
    productoInput.value = "";
    precioInput.value = "";
    imagenInput.value = "";
    observacionInput.value = "";

    return datosForm;
}
//Funcion para guardar datos en local storage
const listadoPedidos = "Pedidos";
function guardarDatos(datos){
    let pedidos =[];

    //Extraer datos guardados previamente en el localStorage
    let pedidosPrevios = JSON.parse(localStorage.getItem(listadoPedidos));

    //Validar los datos previamente guardados en local storage
    if(Array.isArray(pedidosPrevios)){
        pedidos = pedidosPrevios;
    }

    //agregar el pedido nuevo al array
    pedidos.push(datos);
    //guardar en local Storage
    localStorage.setItem(listadoPedidos, JSON.stringify(pedidos));
    //validar que los datos fueron guardados
    alert("Datos guardados con exito");
}

//Funcion para extraer los datos guardados previamente en el localStorage
function mostrarDatos(){
    let pedidos = [];
    let pedidosPrevios = JSON.parse(localStorage.getItem(listadoPedidos));
    if(pedidosPrevios != null){
        pedidos = pedidosPrevios;
    }
    // console.log(pedidos);

    //Mostrar los datos en la tabla

    let contador = 1;
        pedidos.forEach((p,i) => {
        if (p && typeof p === "object" && p.cliente){
        let fila = d.createElement("tr");
        fila.innerHTML = `
            <td> ${contador++} </td>
            <td> ${p.cliente} </td>
            <td> ${p.producto} </td>
            <td> ${p.precio} </td>
            <td> <img src = "${p.imagen}" width = "50%"> </td>
            <td> ${p.observacion} </td>
            <td> 
             <spam onclick= "actualizarPedido(${i})" class ="btn-editar btn btn-warning">📄</spam>
             <spam onclick= "eliminarPedido(${i})" class ="btn-editar btn btn-danger">✖</spam>
            </td>
        `;
        tabla.appendChild(fila);
        }
    });
}
//quitar los datos de la tabla
function borrarTabla(){
    let filas = d.querySelectorAll(".table tbody tr");
    // console.log(filas);
    filas.forEach((f)=>{
        f.remove();
    });
}

//funcion eliminar pedido de la tabla
function eliminarPedido(pos){
    let pedidos = [];
    let pedidosPrevios = JSON.parse(localStorage.getItem(listadoPedidos));
    if(pedidosPrevios != null){
        pedidos = pedidosPrevios;
    }
    //confirmar pedido a eliminar
    let confirmar = confirm("¿Deseas eliminar el pedido " + pedidos[pos].cliente + "?");
    if(confirmar){
        //alert("Lo eliminaste.");
            pedidos.splice(pos,1);
        alert("Pedido eliminado con exito");
        //guardar los datos que quedaron en el localStorage
        localStorage.setItem(listadoPedidos, JSON.stringify(pedidos));
        borrarTabla();
        mostrarDatos();
    }
}

//actualizar pedido de localStorage
function actualizarPedido(pos){
    let pedidos = [];
    let pedidosPrevios = JSON.parse(localStorage.getItem(listadoPedidos));
    if(pedidosPrevios != null){
        pedidos = pedidosPrevios;
    }
    //pasar los datos al formulario
    clienteInpu.value = pedidos[pos].cliente;
    productoInput.value = pedidos[pos].producto;
    precioInput.value = pedidos[pos].precio;
    imagenInput.value = pedidos[pos].imagen;
    observacionInput.value = pedidos[pos].observacion;

    //seleccionar el botón de actualizar
    let btnActualizar = d.querySelector(".btn-actualizar");
    btnActualizar.classList.toggle("d-none");
    btnGuardar.classList.toggle("d-none");

    //agregar evento al botón de actualizar
    btnActualizar.addEventListener("click", function(){
        pedidos[pos].cliente = clienteInpu.value;
        pedidos[pos].producto = productoInput.value;
        pedidos[pos].precio = precioInput.value;
        pedidos[pos].imagen = imagenInput.value;
        pedidos[pos].observacion = observacionInput.value;

    //guardar los datos editados en localStorage
    localStorage.setItem(listadoPedidos, JSON.stringify(pedidos));
    alert("El dato fue actualizado con exito");
    
    clienteInpu.value = "";
    productoInput.value = "";
    precioInput.value = "";
    imagenInput.value = "";
    observacionInput.value = "";

    borrarTabla();
    mostrarDatos();

    btnActualizar.classList.toggle("d-none");
    btnGuardar.classList.toggle("d-none");

    
    })
}

//mostrar los dato de localStorage al recargar la pagina
d.addEventListener("DOMContentLoaded", function(){

    borrarTabla();
    mostrarDatos();
})

//TAREA
document.querySelector(".buscar").addEventListener("input", function () {
    let filtro = this.value.toLowerCase();
    let filas = document.querySelectorAll(".table tbody tr");

    filas.forEach(fila => {
        let nombreCliente = fila.querySelector("td:nth-child(2)").textContent.toLowerCase();
        if (nombreCliente.includes(filtro)) {
            fila.style.display = "";
        } else {
            fila.style.display = "none";
        }
    });
});


document.querySelector(".btn-exportar").addEventListener("click", async function () {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let pedidos = JSON.parse(localStorage.getItem("Pedidos")) || [];

    if (pedidos.length === 0) {
        alert("No hay pedidos para exportar.");
        return;
    }

    for (let index = 0; index < pedidos.length; index++) {
        const p = pedidos[index];
        let y = 20;

        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(`Pedido #${index + 1}`, 10, y);
        y += 10;

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(`Nombre cliente: ${p.cliente}`, 10, y);
        y += 10;
        doc.text(`Producto a comprar: ${p.producto}`, 10, y);
        y += 10;
        doc.text(`Precio Producto: $${p.precio}`, 10, y);
        y += 10;
        doc.text(`Observación del pedido:`, 10, y);
        y += 8;

        let splitObservacion = doc.splitTextToSize(p.observacion, 180);
        doc.text(splitObservacion, 10, y);
        y += splitObservacion.length * 8;

        // Si hay imagen, espera que se cargue y agrégala
        if (p.imagen) {
            try {
                const imgData = await cargarImagenComoBase64(p.imagen);
                doc.addImage(imgData, "JPEG", 10, y, 60, 60);
                y += 65;
            } catch (error) {
                console.error(`Error cargando imagen de ${p.cliente}:`, error);
                doc.text("⚠️ Imagen no cargada", 10, y);
                y += 10;
            }
        }

        // Agrega nueva página si no es el último
        if (index < pedidos.length - 1) {
            doc.addPage();
        }
    }

    doc.save("Pedidos.pdf");
});

// Función para convertir imagen URL en base64
function cargarImagenComoBase64(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = function () {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            const dataURL = canvas.toDataURL("image/jpeg");
            resolve(dataURL);
        };
        img.onerror = reject;
        img.src = url;
    });
}
