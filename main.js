// probar scss
// accion de registrar usuario

// ==========================================================
//              VARIABLES GLOBALES
// ==========================================================
const db = firebase.firestore();
let c = console.log.bind(document);

// arreglo de meses
const mesLetras = [
  "",
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre"
];

// rubros de cada sector
let ragazziOpciones = [];
let patriciosOpciones = [];
let palihueOpciones = [];
let jmolinaOpciones = [];

// fecha actual, con formato  toIsoString()
let fechaActual = new Date().toISOString().substring(0, 10);
let mesActual = +fechaActual.substring(5, 7);
let anioActual = +fechaActual.substring(0, 4);
let tablaActual = anioActual + "_" + mesActual + "_" + mesLetras[mesActual];

//  almacena el numero de linea de almanaque
let num = 1;
//  almacena el numero de linea a editar
let numStringEdit = 0;
//  almacena el total de pagos, en la tabla total
let total = 0;
//  donde se almacenan los pagos que van a almanaque
let linea = {};
//  donde se almacenan los pagos de cada mes
let mesArchivo = {};
let meses = [];
//  breakpoints de screen
let bk = [];

// ==========================================================
//                      DOM
// ==========================================================
const container = document.querySelector(".container")
//        NAV
const nav = document.querySelector(".nav");
const web = document.querySelector(".web");
//        ANCLAS
const a1 = document.querySelector(".a1");
const a2 = document.querySelector(".a2");
const radio1 = document.querySelector(".radio1");
const radio2 = document.querySelector(".radio2");
const aHome = document.getElementById("a-home");
const aArchivo = document.getElementById("a-archivo");
//        USER
const loginUser = document.querySelector(".login-user");
const logoutBtn = document.querySelector(".logout-btn");

//        LOGIN / REG   forms
const errorP = document.querySelector(".error");
const box = document.querySelector(".box");
const introCard = document.querySelector(".intro-card");
const loginFormBox = document.querySelector(".login-form-box");
const regFormBox = document.querySelector(".reg-form-box");
const formLogin = document.getElementById("form-login");
const loginMailInput = document.getElementById("login-mail-input");
const loginPassInput = document.getElementById("login-pass-input");
const formReg = document.getElementById("form-reg");
const regMailInput = document.getElementById("reg-mail-input");
const regPassInput = document.getElementById("reg-pass-input");
const loginSubmit = document.getElementById("login-submit");
const regSubmit = document.getElementById("reg-submit");
const changeToRegBtn = document.getElementById("change-to-reg-btn");
const changeToLoginBtn = document.getElementById("change-to-login-btn");
const heroBtn = document.querySelector(".hero-btn");
const heroLogo = document.querySelector(".hero-logo");
const heroText = document.querySelector(".hero-text");

//        GASTOS
const ragazziForm = document.getElementById("ragazzi-form");
const ragazziSelect = document.getElementById("ragazzi-slc");
const patriciosForm = document.getElementById("patricios-form");
const patriciosSelect = document.getElementById("patricios-slc");
const palihueForm = document.getElementById("palihue-form");
const palihueSelect = document.getElementById("palihue-slc");
const jmolinaForm = document.getElementById("jmolina-form");
const jmolinaSelect = document.getElementById("jmolina-slc");
const variosForm = document.getElementById("varios-form");
const resetBtn = document.querySelector(".reset-btn");

//        TOTAL
const totalTabla = document.querySelector(".total-tabla");
const totalResultado = document.querySelector(".total-resultado");
const resultado = document.querySelector(".resultado");

//        ALMANAQUE
const almanaqueTablas = document.querySelector(".almanaque-tablas");
const almanaqueTablaData = document.querySelectorAll(".almanaque-tabla-data");
const editForm = document.getElementById("edit-form");

//        ARCHIVO
const archivoBox = document.querySelector(".archivo-box");
const archivoMeses = document.querySelector(".archivo-meses");

//        TEMPLATE
const templateLinea = document.querySelector("#tpl-linea").content;

// ==========================================================
//                  EVENTOS
// ==========================================================

//        NAV ANCLAS
web.addEventListener("click", (e) => {
  document.querySelector(".web-links").classList.toggle("not-hide-flex-row");
});

//        NAV RADIOs SCROLL
container.addEventListener("scroll", (e) => {
  if (-aHome.getBoundingClientRect().top < 100) {radio1.checked = true;}
  if (aArchivo.getBoundingClientRect().top < 10) {radio2.checked = true;}
}, { passive: true });

//        NAV RADIOs CLICK
a1.addEventListener("click", () => {
  radio1.checked = true;
});
a2.addEventListener("click", () => {
  radio2.checked = true;
});

//         NAV LOG OUT
logoutBtn.addEventListener("click", (e) => {
  auth.signOut();
  e.stopPropagation();
});


//          FORMs
//========================
//           SUBMITs
let loginMailOk = false;
let loginPassOk = false;
let regMailOk = false;
let regPassOk = false;
let heroBtnOk = false;

formLogin.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = formLogin["login-mail-input"].value;
  const password = formLogin["login-pass-input"].value;
  auth
    .signInWithEmailAndPassword(email, password)
    .then((userCredentials) => {
      console.log("usuario logueado");
      // formLogin.classList.remove("visible");
      formLogin.reset();
      formReg.reset();
      loginMailOk =
      loginPassOk =
      regMailOk =
      regPassOk = false;
      errorP.innerText = "";

    })
    .catch((error) => {
      errorP.innerText = error.message;
    });
});
formReg.addEventListener("submit", (e) => {
  e.preventDefault();
  formLogin.reset();
  formReg.reset();
  loginMailOk =
  loginPassOk =
  regMailOk =
  regPassOk = false;
  errorP.innerText = "";
});

//            INPUT ROJO O VERDE

loginMailInput.addEventListener("keyup", (e) => {
  if (loginMailInput.value.length > 4) {
    loginMailInput.style.backgroundColor = "rgba(56, 150, 9, 0.2)";
    loginMailInput.style.color = "green";
    loginMailOk = true;
    if (loginPassOk) {
      loginSubmit.style.backgroundColor = "rgba(56, 150, 9, 0.2)";
      loginSubmit.children[0].style.fill = "green";
    } else {
      loginSubmit.style.backgroundColor = "transparent";
      loginSubmit.children[0].style.fill = "gray";
    }
  } else {
    loginMailInput.style.backgroundColor = "rgba(109, 7, 7, 0.15)";
    loginMailInput.style.color = "#6d0707";
    loginMailOk = false;
    loginSubmit.style.backgroundColor = "transparent";
    loginSubmit.children[0].style.fill = "gray";
  }
});
loginPassInput.addEventListener("keyup", (e) => {
  if (loginPassInput.value.length > 4) {
    loginPassInput.style.backgroundColor = "rgba(56, 150, 9, 0.2)";
    loginPassInput.style.color = "green";
    loginPassOk = true;
    if (loginMailOk) {
      loginSubmit.style.backgroundColor = "rgba(56, 150, 9, 0.2)";
      loginSubmit.children[0].style.fill = "green";
    } else {
      loginSubmit.style.backgroundColor = "transparent";
      loginSubmit.children[0].style.fill = "gray";
    }
  } else {
    loginPassInput.style.backgroundColor = "rgba(109, 7, 7, 0.15)";
    loginPassInput.style.color = "#6d0707";
    loginPassOk = false;
    loginSubmit.style.backgroundColor = "transparent";
    loginSubmit.children[0].style.fill = "gray";
  }
});

regMailInput.addEventListener("keyup", (e) => {
  if (regMailInput.value.length > 4) {
    regMailInput.style.backgroundColor = "rgba(56, 150, 9, 0.2)";
    regMailInput.style.color = "green";
    regMailOk = true;
    if (regPassOk) {
      regSubmit.style.backgroundColor = "rgba(56, 150, 9, 0.2)";
      regSubmit.children[0].style.fill = "green";
    } else {
      regSubmit.style.backgroundColor = "transparent";
      regSubmit.children[0].style.fill = "gray";
    }
  } else {
    regMailInput.style.backgroundColor = "rgba(109, 7, 7, 0.15)";
    regMailInput.style.color = "#6d0707";
    regMailOk = false;
    regSubmit.style.backgroundColor = "transparent";
    regSubmit.children[0].style.fill = "gray";
  }
});
regPassInput.addEventListener("keyup", (e) => {
  if (regPassInput.value.length > 4) {
    regPassInput.style.backgroundColor = "rgba(56, 150, 9, 0.2)";
    regPassInput.style.color = "green";
    regPassOk = true;
    if (regMailOk) {
      regSubmit.style.backgroundColor = "rgba(56, 150, 9, 0.2)";
      regSubmit.children[0].style.fill = "green";
    } else {
      regSubmit.style.backgroundColor = "transparent";
      regSubmit.children[0].style.fill = "gray";
    }
  } else {
    regPassInput.style.backgroundColor = "rgba(109, 7, 7, 0.15)";
    regPassInput.style.color = "#6d0707";
    regPassOk = false;
    // regMailInput.style.backgroundColor = "rgba(109, 7, 7, 0.15)";
    // regMailInput.style.color = "#6d0707";
    regSubmit.style.backgroundColor = "transparent";
    regSubmit.children[0].style.fill = "gray";
  }
});

//            CAMBIO LOGIN O REGISTRAR
changeToRegBtn.addEventListener("click", (e) => {
  loginFormBox.style.transform = "translateX(-220%)";
  regFormBox.style.transform = "translateX(-232%)";
  formLogin.reset();
  loginMailOk =
  loginPassOk = false;
  errorP.innerText = "";
  loginMailInput.style.backgroundColor = "rgba(109, 7, 7, 0.15)";
  loginMailInput.style.color = "#6d0707";
  loginPassInput.style.backgroundColor = "rgba(109, 7, 7, 0.15)";
  loginPassInput.style.color = "#6d0707";
  loginSubmit.style.backgroundColor = "transparent";
  loginSubmit.children[0].style.color = "gray";
});
changeToLoginBtn.addEventListener("click", (e) => {
  loginFormBox.style.transform = "translateX(-110%)";
  regFormBox.style.transform = "translateX(-115%)";
  formReg.reset();
  regMailOk =
  regPassOk = false;
  errorP.innerText = "";
  regMailInput.style.backgroundColor = "rgba(109, 7, 7, 0.15)";
  regMailInput.style.color = "#6d0707";
  regPassInput.style.backgroundColor = "rgba(109, 7, 7, 0.15)";
  regPassInput.style.color = "#6d0707";
  regSubmit.style.backgroundColor = "transparent";
  regSubmit.children[0].style.color = "gray";
});
heroBtn.addEventListener("click", (e) => {
  if (!heroBtnOk) {
    heroLogo.style.transform = "scale(1) translateY(0%)";
    heroText.style.transform = "scale(1) translateY(0%)";
    loginFormBox.style.transition = "1.2s ease";
    regFormBox.style.transition = "1.2s ease";
    loginFormBox.style.transform = "translateX(-110%)";
    regFormBox.style.transform = "translateX(-115%)";
    heroBtnOk = true;
  } else {
    heroLogo.style.transform = "scale(1.5) translateY(75%)";
    heroText.style.transform = "scale(1.5) translateY(210%)";
    loginFormBox.style.transition = "0s ease";
    regFormBox.style.transition = "0s ease";
    loginFormBox.style.transform = "translateX(105%)";
    regFormBox.style.transform = "translateX(215%)";
    heroBtnOk = false;
  }
});

//        GASTOS
ragazziForm.addEventListener("submit", (e) => {
  e.preventDefault();
  clickBotonFlecha("ragazzi");
});
patriciosForm.addEventListener("submit", (e) => {
  e.preventDefault();
  clickBotonFlecha("patricios");
});
palihueForm.addEventListener("submit", (e) => {
  e.preventDefault();
  clickBotonFlecha("palihue");
});
jmolinaForm.addEventListener("submit", (e) => {
  e.preventDefault();
  clickBotonFlecha("jmolina");
});
variosForm.addEventListener("submit", (e) => {
  e.preventDefault();
  clickBotonFlecha("varios");
});
resetBtn.addEventListener("click", (e) => clickReset(e));

//        ALMANAQUE
almanaqueTablas.addEventListener("click", (e) => clickCheckbox(e));
almanaqueTablas.addEventListener("click", (e) => clickAlmanaque(e));
editForm.addEventListener("submit", (e) => {
  e.preventDefault();
  editarForm();
});

//        ARCHIVO
archivoMeses.addEventListener("click", (e) => clickMes(e));

// ==========================================================
//                DOM FUNCIONES
// ==========================================================

//  PINTAR TABLA GASTOS
// ====================
const pintarTablaGastos = (opcionesArreglo, elementoSelect) => {
  let html = "<option></option>";
  opcionesArreglo.forEach((opcion) => {
    html += `<option>${opcion}</option>
    `;
  });
  elementoSelect.innerHTML = html;
};

//  PINTAR TABLA ALMANAQUE
// =======================
const pintarTablaAlmanaque = () => {
  // tituloAlmanaque.textContent = `${mesLetras[mesActual].toUpperCase()}`;

  Object.entries(linea).forEach(([numLinea, pago]) => {
    //  clono la linea
    const clone = templateLinea.cloneNode(true);

    // almaceno los numeros de linea para cuando los clickee
    clone.querySelector(".chk-label").dataset.id = numLinea;
    clone.querySelector(".checkbox").setAttribute("id", `CHK-${numLinea}`);
    clone.querySelector(".chk-label").setAttribute("for", `CHK-${numLinea}`);
    clone.querySelector(".bx-check-circle").dataset.id = numLinea;
    clone.querySelector(".bx-x-circle").dataset.id = numLinea;
    clone.querySelector(".bxs-pencil").dataset.id = numLinea;

    clone.querySelector(".linea").classList.add(`L${numLinea}`);
    clone.querySelector(".linea").classList.add(`${linea[numLinea].sector}-bg`);
    clone.querySelector(".fecha").textContent = linea[numLinea].date;
    clone.querySelector(".sector").textContent = linea[
      numLinea
    ].sector.toUpperCase();
    clone.querySelector(".rubro").textContent = linea[numLinea].rubro;
    clone.querySelector(".monto").textContent = formatMonto(
      linea[numLinea].monto
    );
    clone.querySelector(".pagado").textContent = "";

    let dia = linea[numLinea].date.substring(0, 2);
    document.getElementById(`A${dia}`).classList.add("visible");
    document.getElementById(`A${dia}`).appendChild(clone);
  });

  // pinto de rojo solo la tabla almanaque del dia
  let dia = fechaActual.substr(8);
  almanaqueTablaData.forEach((tabla) =>
    tabla.classList.remove(".fecha-actual")
  );
  document.getElementById(`A${dia}`).classList.add("fecha-actual");
};

//  PINTAR TABLA ARCHIVO
// ======================
const pintarTablaArchivo = () => {
  archivoMeses.innerHTML = "";

  //cago los 13 ultimos meses, ix es mi indice
  let ix = 1;

  for (let mes of meses) {
    // pongo el titulo del mes en class ".mes-1"
    document.querySelector(`.mes-${ix}`).innerText = mes
      .replaceAll("_", "\u00A0\u00A0\u00A0")
      .toUpperCase();

    // cuantos pagos hay en cada mes
    let totalPagosMes = Object.keys(mesArchivo[mes]).length;

    for (let i = 1; i <= totalPagosMes; i++) {
      let index = i < 10 ? "0" + i : i.toString();
      //  clono la linea
      const clone = templateLinea.cloneNode(true);
      clone
        .querySelector(".linea")
        .classList.add(`${mesArchivo[mes][index].sector}-bg`);
      clone.querySelector(".fecha").textContent = mesArchivo[mes][index].date;
      clone.querySelector(".sector").textContent = mesArchivo[mes][
        index
      ].sector.toUpperCase();
      clone.querySelector(".rubro").textContent = mesArchivo[mes][index].rubro;
      clone.querySelector(".monto").textContent = formatMonto(
        mesArchivo[mes][index].monto
      );
      clone.querySelector(".pagado").textContent =
        mesArchivo[mes][index].fechaPagado;

      document.getElementById(`ar-${ix}`).appendChild(clone);
    }

    // pinto el boton del mes en cuestion
    let btn = document.createElement("BUTTON");
    btn.innerHTML = `${mes.replaceAll("_", " ").toUpperCase()}`;
    btn.classList.add(`btn-${ix}`, `archivo-mes-btn`);
    archivoMeses.appendChild(btn);

    ix++;
  }

  // activo boton y fechas del mes vigente
  document.querySelector(`.btn-13`).classList.add("activo");
  document.getElementById(`ar-13`).classList.add("visible");
};

//  CLICK BOTON FLECHA
// ====================
const clickBotonFlecha = async (sector) => {
  let rubro, monto, fecha, date;
  let fechaPagado = "";

  // obtengo los datos del formulario correspondiente
  switch (sector) {
    case "ragazzi":
      rubro = ragazziForm["ragazzi-slc"].value;
      monto = ragazziForm["ragazzi-monto"].value;
      fecha = ragazziForm["ragazzi-fecha"].value || fechaActual;
      date = fecha.substr(8, 2) + "-" + fecha.substr(5, 2);

      // quito del arreglo opciones y actualizo DOM
      let indice = ragazziOpciones.indexOf(rubro);
      ragazziOpciones.splice(indice, 1);
      pintarTablaGastos(ragazziOpciones, ragazziSelect);

      // actualizo opciones del firebase
      await guardarOpciones("ragazzi", ragazziOpciones);
      break;

    case "patricios":
      rubro = patriciosForm["patricios-slc"].value;
      monto = patriciosForm["patricios-monto"].value;
      fecha = patriciosForm["patricios-fecha"].value || fechaActual;
      date = fecha.substr(8, 2) + "-" + fecha.substr(5, 2);

      // quito del arreglo opciones y actualizo DOM
      let indice2 = patriciosOpciones.indexOf(rubro);
      patriciosOpciones.splice(indice2, 1);
      pintarTablaGastos(patriciosOpciones, patriciosSelect);

      // actualizo opciones del firebase
      await guardarOpciones("patricios", patriciosOpciones);
      break;

    case "palihue":
      rubro = palihueForm["palihue-slc"].value;
      monto = palihueForm["palihue-monto"].value;
      fecha = palihueForm["palihue-fecha"].value || fechaActual;
      date = fecha.substr(8, 2) + "-" + fecha.substr(5, 2);

      // quito del arreglo opciones y actualizo DOM
      let indice3 = palihueOpciones.indexOf(rubro);
      palihueOpciones.splice(indice3, 1);
      pintarTablaGastos(palihueOpciones, palihueSelect);

      // actualizo opciones del firebase
      await guardarOpciones("palihue", palihueOpciones);
      break;

    case "jmolina":
      rubro = jmolinaForm["jmolina-slc"].value;
      monto = jmolinaForm["jmolina-monto"].value;
      fecha = jmolinaForm["jmolina-fecha"].value || fechaActual;
      date = fecha.substr(8, 2) + "-" + fecha.substr(5, 2);

      // quito del arreglo opciones y actualizo DOM
      let indice4 = jmolinaOpciones.indexOf(rubro);
      jmolinaOpciones.splice(indice4, 1);
      pintarTablaGastos(jmolinaOpciones, jmolinaSelect);

      // actualizo opciones del firebase
      await guardarOpciones("jmolina", jmolinaOpciones);
      break;

    case "varios":
      rubro = variosForm["varios-txt"].value;
      monto = variosForm["varios-monto"].value;
      fecha = variosForm["varios-fecha"].value || fechaActual;
      date = fecha.substr(8, 2) + "-" + fecha.substr(5, 2);
      break;

    default:
      break;
  }

  // creo la linea de pago
  // let color = colorSector[sector];
  let numString = num < 10 ? "0" + num : num.toString();
  linea[numString] = { date, sector, rubro, monto, fechaPagado };

  // almaceno linea en firebase
  await db
    .collection("almanaque_linea")
    .doc(numString)
    .set({ date, sector, rubro, monto, fechaPagado });
  c("pago guardado en coleccion LINEA");

  // inserto en la tabla almanaque
  insertarLinea(numString, "A");

  // reseteo los valor de la tabla gasto
  resetFormGastos();

  // incremento el numero de linea
  num++;
};

//  CLICK RESET
// ===============
const clickReset = async (e) => {
  c(mesArchivo);
  c("**** RESET TOTAL ****");

  // resetear formularios y arreglos locales
  resetFormGastos();

  // almaceno el nombre en archivos, asi despues puedo listarlos
  let mesProximo = mesActual + 1;
  let anioProximo = anioActual;

  if (mesProximo === 13) {
    mesProximo = 1;
    anioProximo = anioActual + 1;
  }
  mesProximo = mesProximo < 10 ? "0" + mesProximo : +mesProximo;
  let fechaProxima = `${anioProximo}_${mesProximo}_${mesLetras[+mesProximo]}`;

  const nombreArchivo =
    prompt(
      `Ingrese nombre de archivo del mes proximo ejemplo : `,
      fechaProxima + ""
    ) || fechaProxima;
  await db.collection("archivo_meses").doc(nombreArchivo).set({});

  // reseteo los arreglos locales de opciones
  await cargarGastosArreglos("gastos_reset");

  // resetear linea local (almanaque, total)
  resetLineas();

  // borro coleccion ALMANAQUE_LINEA de firebase
  let querySnapshot = await db.collection("almanaque_linea").get();
  querySnapshot.forEach((doc) => doc.ref.delete());
  c("coleccion ALMANAQUE_LINEA borrada");

  // agrego mes, quito otro y re pinto tabla archivo
  mesArchivo[nombreArchivo] = {};
  meses.push(nombreArchivo);
  meses.shift();

  pintarTablaArchivo();

  e.stopPropagation();
};

//  CLICK CHECKBOX
// ================
const clickCheckbox = (e) => {

  if (e.target.classList.contains("chk-label")) {

    // obtengo el numero de la linea
    let numString = e.target.dataset.id;
    c(e.target.parentNode.children[0].checked, numString)

    //  si pusimos el checkbox
    if (!e.target.parentNode.children[0].checked) {

      // hago visible la tabla si hay un check
      totalTabla.classList.add("visible");

      // inserto linea en tabla total
      insertarLinea(numString, "T");

      // sumo el total de la tabla total
      total += parseInt(linea[numString].monto, 10);
      resultado.textContent = formatMonto("" + total);
    }
     else {
      // si quito el checkbox

      total -= parseInt(linea[numString].monto, 10);
      resultado.textContent = formatMonto("" + total);
      totalTabla.removeChild(totalTabla.querySelector(`.L${numString}`));

      // si la tabla de total esta vacia
      if (Object.values(totalTabla.children).length === 1) {
        totalTabla.classList.remove("visible");
        total = 0;
      }
    }
  }
};

//  CLICK ALMANAQUE
// ================
const clickAlmanaque = (e) => {
  if (e.target.classList.contains("bx-check-circle")) {
    // obtengo el numero de la linea
    let numString = e.target.dataset.id;
    pagado(numString);
    return;
  }
  if (e.target.classList.contains("bx-x-circle")) {
    // obtengo el numero de la linea
    let numString = e.target.dataset.id;
    cancelado(numString);
    return;
  }
  if (e.target.classList.contains("bxs-pencil")) {
    // obtengo el numero de la linea
    let numString = e.target.dataset.id;
    numStringEdit = numString;
    editar(numString, e);
    return;
  }
  e.stopPropagation();
};

//  CLICK MES
//===========
const clickMes = (e) => {
  let btn = e.target;
  if (btn.classList.contains("archivo-mes-btn")) {
    let mes = btn.classList[0];
    let mesNum = +mes.substring(4);
    document.querySelector(`.${mes}`).classList.toggle("activo");

    // if (meses.includes(mesLetras[mesNum])) {
    document.getElementById(`ar-${mesNum}`).classList.toggle("visible");
    // }
  }
  e.stopPropagation();
};

//  EDITAR
//========
const editar = (numString, e) => {
  c("editando linea ");

  // reseteo primero el formulario editar
  editForm.reset();

  // obtengo la posicion vertical donde se va a mostrar
  let posY = e.clientY - 200;
  // if (screen.width < 1400) {
  //   posY -= 50;
  // }
  // if (screen.width < 750) {
  //   posY -= 100;
  // }
  editForm.classList.add("not-hide-flex-row");
  editForm.style.setProperty("top", `${posY}px`);

  // obtengo los datos de la linea
  let { date, sector, rubro, monto, fechaPagado } = linea[numString];

  // muestro los datos de la linea en los inputs
  let editLabel = `${sector.toUpperCase()} \u00A0\u00A0 ${rubro}`;
  document.querySelector(".edit-label").textContent = editLabel;
  document.querySelector(".edit-monto").value = monto;
  let d = date.substring(0, 2);
  let m = date.substring(3, 5);
  let f = "2021-" + m + "-" + d;
  document.querySelector(".edit-fecha").value = f;
};

//  EDITAR-FORM
//=============
const editarForm = async () => {
  c("click en submit *******");
  // obtengo los datos de la linea
  let { date, sector, rubro, monto, fechaPagado } = linea[numStringEdit];

  // obtengo la fecha y el monto de los imputs
  let d = editForm["edit-fecha"].value.substring(8, 10);
  let m = editForm["edit-fecha"].value.substring(5, 7);
  let dateNew = d + "-" + m;
  let montoNew = editForm["edit-monto"].value;

  // si cambio alguno de los 2 valores
  if (monto !== montoNew || date !== dateNew) {
    //  si el monto es ditinto, actualizo monto, arreglo local LINEA y DOM
    if (monto !== montoNew) {
      c("cambio monto");
      monto = montoNew;
      linea[numStringEdit].monto = montoNew;
      document.querySelector(
        `.L${numStringEdit} .monto`
      ).textContent = formatMonto(monto);
    }

    //  si las fechas son distintas
    if (date !== dateNew) {
      c("cambio date");
      // quito la linea tanto de almanaque y total
      quitarLinea(numStringEdit);

      // actualizo date y arreglo local LINEA
      date = dateNew;
      linea[numStringEdit].date = dateNew;

      // coloco la linea en su nuevo dia DOM
      insertarLinea(numStringEdit, "A");
    }

    //  actualizo firebase LINEA
    await db
      .collection("almanaque_linea")
      .doc(numStringEdit)
      .set({ date, sector, rubro, monto, fechaPagado });
  }

  //  oculto el formulario de edicion
  editForm.classList.remove("not-hide-flex-row");
};

//  PAGADO
// ========
const pagado = async (numString) => {
  c("entro a pagado con el numString", numString);

  // obtengo el dia del vencimiento y fijo fechaPagado
  let fechaPagadoAux =
    fechaActual.substr(8, 2) + "-" + fechaActual.substr(5, 2);
  linea[numString].fechaPagado = fechaPagadoAux;
  let { date, sector, rubro, monto, fechaPagado } = linea[numString];
  //let dia = linea[numString].date.substring(0, 2);

  // inserto linea en tabla ARCHIVO
  insertarLinea(numString, "Ar");

  // almaceno en arreglo Archivo
  let ultimoMes = meses[meses.length - 1];
  let numProx = Object.keys(mesArchivo[ultimoMes]).length + 1;
  numProx = numProx < 10 ? "0" + numProx : numProx.toString();
  mesArchivo[ultimoMes][numProx] = { date, sector, rubro, monto, fechaPagado };

  // almaceno pago en firebase
  await db
    .collection(ultimoMes)
    .doc(numProx)
    .set({ date, sector, rubro, monto, fechaPagado });
  c("pago guardado en Archivo");

  // quito la linea tanto de almanaque y total
  quitarLinea(numString);

  // quito el pago del arreglo linea
  delete linea[numString];

  // quito el pago de la coleccion linea
  await db.collection("almanaque_linea").doc(numString).delete();
};

//  CANCELADO
// ===========
const cancelado = async (numString) => {
  //  agrego nuevamente a las opciones del sector, y actualizo DOM
  let sector = linea[numString].sector;
  let rubro = linea[numString].rubro;
  switch (sector) {
    case "ragazzi":
      ragazziOpciones.push(rubro);
      ordenarArreglo(ragazziOpciones);
      pintarTablaGastos(ragazziOpciones, ragazziSelect);

      // actualizo opciones del firebase
      await guardarOpciones("ragazzi", ragazziOpciones);
      break;

    case "palihue":
      palihueOpciones.push(rubro);
      ordenarArreglo(palihueOpciones);
      pintarTablaGastos(palihueOpciones, palihueSelect);

      // actualizo opciones del firebase
      await guardarOpciones("palihue", palihueOpciones);
      break;

    case "patricios":
      patriciosOpciones.push(rubro);
      ordenarArreglo(patriciosOpciones);
      pintarTablaGastos(patriciosOpciones, patriciosSelect);

      // actualizo opciones del firebase
      await guardarOpciones("patricios", patriciosOpciones);
      break;

    case "jmolina":
      jmolinaOpciones.push(rubro);
      ordenarArreglo(jmolinaOpciones);
      pintarTablaGastos(jmolinaOpciones, jmolinaSelect);

      // actualizo opciones del firebase
      await guardarOpciones("jmolina", jmolinaOpciones);
      break;
    default:
      break;
  }

  // quito la linea tanto de almanaque y total
  quitarLinea(numString);

  // borro el pago de la linea
  delete linea[numString];

  // borro el pago del firebase
  await db.collection("almanaque_linea").doc(numString).delete();
};

//  INSERTAR LINEA
//=================
const insertarLinea = (numLinea, tabla) => {
  c("insertar linea");
  //  clono la linea
  const clone = templateLinea.cloneNode(true);

  // almaceno los numeros de linea para cuando los clickee
  if (tabla !== "T") {
    clone.querySelector(".chk-label").dataset.id = numLinea;
    clone.querySelector(".checkbox").setAttribute("id", `CHK-${numLinea}`);
    clone.querySelector(".chk-label").setAttribute("for", `CHK-${numLinea}`);
    clone.querySelector(".bx-check-circle").dataset.id = numLinea;
    clone.querySelector(".bx-x-circle").dataset.id = numLinea;
    clone.querySelector(".bxs-pencil").dataset.id = numLinea;
  }

  clone.querySelector(".linea").classList.add(`L${numLinea}`);
  clone.querySelector(".linea").classList.add(`${linea[numLinea].sector}-bg`);
  clone.querySelector(".fecha").textContent = linea[numLinea].date;
  clone.querySelector(".sector").textContent = linea[
    numLinea
  ].sector.toUpperCase();
  clone.querySelector(".rubro").textContent = linea[numLinea].rubro;
  clone.querySelector(".monto").textContent = formatMonto(
    linea[numLinea].monto
  );
  clone.querySelector(".pagado").textContent = linea[numLinea].fechaPagado;

  //  inserto en ALMANAQUE
  if (tabla === "A") {
    let dia = linea[numLinea].date.substring(0, 2);
    document.getElementById(`A${dia}`).classList.add("visible");
    document.getElementById(`A${dia}`).appendChild(clone);
    return;
  }

  //  inserto en TOTAL
  if (tabla === "T") {
    totalTabla.insertBefore(clone, totalResultado);
    return;
  }

  // inserto en ARCHIVO
  if (tabla === "Ar") {
    clone
      .querySelector(".linea")
      .classList.replace(`L${numLinea}`, `Ar${numLinea}`);
    document.getElementById(`ar-13`).appendChild(clone);
    return;
  }
};

//  QUITAR LINEA
//===============
const quitarLinea = (numLinea) => {
  c("quitar linea");
  // si estaba en total, hay 2 lineas, resto el resultado
  let lineas = document.querySelectorAll(`.L${numLinea}`);
  if (Array.from(lineas).length > 1) {
    total -= parseInt(linea[numLinea].monto, 10);
    resultado.textContent = total;
  }

  //  quito la linea de la tabla almanaque y total
  Array.from(lineas).forEach((linea) => {
    linea.parentNode.removeChild(linea);
  });

  // si almanaque tabla quedo vacia, la oculto
  let dia = linea[numLinea].date.substring(0, 2);
  let tablaAlmanaqueDia = document.getElementById(`A${dia}`);
  if (Object.values(tablaAlmanaqueDia.children).length === 0) {
    tablaAlmanaqueDia.classList.remove("visible");
  }

  // oculto tabla total si es que esta vacia
  if (Object.values(totalTabla.children).length === 1) {
    totalTabla.classList.remove("visible");
    total = 0;
  }
};

//  RESET FORM GASTOS
// ==================
const resetFormGastos = () => {
  ragazziForm.reset();
  patriciosForm.reset();
  palihueForm.reset();
  jmolinaForm.reset();
  variosForm.reset();
};

//  RESET LINEAS
// ================
const resetLineas = () => {
  total = 0;
  linea = {};
  num = 1;
  let lineas = document.querySelectorAll(".linea");
  lineas.forEach((linea) => linea.parentNode.removeChild(linea));
  let visibles = document.querySelectorAll(".visible");
  visibles.forEach((visible) => visible.classList.remove("visible"));
  c("tablas reseteadas");
};

//  ORDENAR ARREGLO
// ================
const ordenarArreglo = (arr) => {
  arr.sort((a, b) => a.localeCompare(b));
};

//  FORMAT MONTO
// =============
const formatMonto = (montoAnt) => {
  if (montoAnt.length > 3) {
    let miles = montoAnt.substring(0, montoAnt.length - 3);
    let centenas = montoAnt.substring(montoAnt.length - 3);
    return "$ " + miles + "." + centenas;
  }

  return "$ " + montoAnt;
};

// ==========================================================
//                FIREBASE
// ==========================================================
//  VERIFICAR AUTH
// ================
auth.onAuthStateChanged(async (user) => {
  let userN = "";

  // si hay usuario logueado, muestro data
  if (user) {
    let userName = user.email;
    userN = userName.substring(0, 7);
    c("USUARIO:", user.email);

    // muestro nav y formularios
    nav.classList.add("not-hide-flex-row");
    introCard.classList.remove("not-hide-block");
    box.classList.add("not-hide-flex-row");
    archivoBox.classList.add("not-hide-flex-col");
    loginUser.innerHTML = userN.toUpperCase();

    try {
      // cargo y pinto las opciones de la coleccion gastos_actual
      // cargo y pinto los pagos de la coleccion linea_almanaque

     console.time("**** CARGO DATOS DE FIRESTORE ****  ");

      await Promise.all([
        cargarMeses("archivo_meses"),
        cargarGastosArreglos("gastos_actual"),
        cargarLinea()
      ]);

      // cargo y pinto los meses de archivo
      await cargarArchivo();

      console.timeEnd("**** CARGO DATOS DE FIRESTORE ****  ");

    } catch (error) {
      c(error.message);
    }

    //CODIGO PARA MODIFICAR EL FIREBASE MANUALMENTE
    //c("aca modifco el firebase");
    //await modificarOpciones();
    //await modificarAlmanaque();
    // await modificarMes();
  }

  // si no hay usuario logueado, muestro formulario de login
  else {
    c("usuario no logueado");
    nav.classList.remove("not-hide-flex-row");
    introCard.classList.add("not-hide-block");
    loginUser.innerHTML = "";
    box.classList.remove("not-hide-flex-row");
    archivoBox.classList.remove("not-hide-flex-col");
    loginMailInput.style.backgroundColor = "rgba(109, 7, 7, 0.15)";
    loginMailInput.style.color = "#6d0707";
    loginPassInput.style.backgroundColor = "rgba(109, 7, 7, 0.15)";
    loginPassInput.style.color = "#6d0707";
    loginSubmit.style.backgroundColor = "transparent";
    loginSubmit.children[0].style.color = "gray";
  }
});

//  CARGAR GASTOS ARREGLOS (de db a arreglos locales)
// =======================
const cargarGastosArreglos = async (collection) => {
  let data = await db.collection(collection).get();

  // si es collection = gastos, cargo lo que este en GASTOS a los arreglos locales
  // si es collection = reset, cargo lo que este en RESET a los arreglos locales
  jmolinaOpciones = data.docs[0].data().opciones;
  palihueOpciones = data.docs[1].data().opciones;
  patriciosOpciones = data.docs[2].data().opciones;
  ragazziOpciones = data.docs[3].data().opciones;

  if (collection === "gastos_reset") {
    // si es reset, mando a firebase lo que tengo en los arreglos locales reseteados
    let opciones = ragazziOpciones;
    await db.collection("gastos_actual").doc("ragazzi").set({ opciones });
    opciones = patriciosOpciones;
    await db.collection("gastos_actual").doc("patricios").set({ opciones });
    opciones = palihueOpciones;
    await db.collection("gastos_actual").doc("palihue").set({ opciones });
    opciones = jmolinaOpciones;
    await db.collection("gastos_actual").doc("jmolina").set({ opciones });
    c("opciones reseteadas");
  }

  pintarTablaGastos(ragazziOpciones, ragazziSelect);
  pintarTablaGastos(patriciosOpciones, patriciosSelect);
  pintarTablaGastos(palihueOpciones, palihueSelect);
  pintarTablaGastos(jmolinaOpciones, jmolinaSelect);
};

//  CARGAR LINEA (de db a arreglos locales)
// =============
const cargarLinea = async () => {
  let querySnapshot = await db.collection("almanaque_linea").get();

  if (querySnapshot.size > 0) {
    querySnapshot.forEach((doc) => {
      linea[doc.id] = doc.data();
      if (num <= parseInt(doc.id, 10)) {
        num = parseInt(doc.id, 10);
      }

      num++;
    });

    //c("almanaque cargado");
    pintarTablaAlmanaque();
  }
};

//  CARGAR MESES (de db a arreglos locales)
// =============
const cargarMeses = async () => {
  let mesesAux = [];
  let querySnapshot = await db.collection("archivo_meses").get();
  if (querySnapshot.size > 0) {
    querySnapshot.forEach((doc) => {
      mesesAux.push(doc.id);
    });
  }

  // cargo en el arreglo meses los ultimos 13 meses de firebase
  meses = mesesAux.slice(-13);
};

// CARGAR ARCHIVO  (de db a arreglos locales)
// ===============
const cargarArchivo = async () => {

  // cargo los 13 meses con un promise.all
  let [
    mes0,
    mes1,
    mes2,
    mes3,
    mes4,
    mes5,
    mes6,
    mes7,
    mes8,
    mes9,
    mes10,
    mes11,
    mes12
  ] = await Promise.all([
    db.collection(meses[0]).get(),
    db.collection(meses[1]).get(),
    db.collection(meses[2]).get(),
    db.collection(meses[3]).get(),
    db.collection(meses[4]).get(),
    db.collection(meses[5]).get(),
    db.collection(meses[6]).get(),
    db.collection(meses[7]).get(),
    db.collection(meses[8]).get(),
    db.collection(meses[9]).get(),
    db.collection(meses[10]).get(),
    db.collection(meses[11]).get(),
    db.collection(meses[12]).get()
  ]);

  // cargo de db a mesArchivo
  mesArchivo[meses[0]] = cargarMes(mes0);
  mesArchivo[meses[1]] = cargarMes(mes1);
  mesArchivo[meses[2]] = cargarMes(mes2);
  mesArchivo[meses[3]] = cargarMes(mes3);
  mesArchivo[meses[4]] = cargarMes(mes4);
  mesArchivo[meses[5]] = cargarMes(mes5);
  mesArchivo[meses[6]] = cargarMes(mes6);
  mesArchivo[meses[7]] = cargarMes(mes7);
  mesArchivo[meses[8]] = cargarMes(mes8);
  mesArchivo[meses[9]] = cargarMes(mes9);
  mesArchivo[meses[10]] = cargarMes(mes10);
  mesArchivo[meses[11]] = cargarMes(mes11);
  mesArchivo[meses[12]] = cargarMes(mes12);

  pintarTablaArchivo();
};

// CARGAR MES
// ==========

//cargo los doc.id y los doc.data en un objeto
const cargarMes = (mes) => {
  let objeto = {};

  if (mes.size > 0) {
    mes.forEach((doc) => {
      objeto[doc.id] = doc.data();
    });
  }
  return objeto;
};

//  GUARDAR OPCIONES (de arreglos locales a db)
// =================
const guardarOpciones = async (sector, opciones) => {
  await db.collection("gastos_actual").doc(sector).set({ opciones });
};

/*
//  MODIFICAR OPCIONES MANUALMENTE
// =================
const modificarOpciones = async () => {

  const jmolinaOpciones2 = ['AGUA', 'CELULAR', 'FAVACARD', 'GAS', 'LUZ', 'MUNI', 'PATENTE', 'RENTAS', 'MONOT LI'];
  const palihueOpciones2 = ['AGUA', 'CABLE', 'GAS', 'LUZ', 'MUNI', 'MUNI MO', 'RENTAS', 'TELEFONO'];
  const patriciosOpciones2 = ['CELULAR', 'COCHERA', 'COMPL', 'COMPL MO', 'FEDERADA', 'GAS', 'LUZ', 'MASTER', 'MUNI', 'MUNI MO', 'PATENTE', 'RENTAS', 'VISA', 'AUTON', 'AUTON MO'];
  const ragazziOpciones2 = ['AGUA', 'CONTADOR', 'GAS', 'IVA', 'LUZ', 'MUNI', 'MUNI MO', 'SINDICATO', 'SUELDO G', 'SUELDO R', 'SUSS', 'TASA', 'TELEFONO', 'TRANSP A', 'TRANSP B', 'SEGURO', 'INTERNET', 'INGR BR'];

   await db.collection("gastos_reset").doc("jmolina").set({jmolinaOpciones2})
   await db.collection("gastos_reset").doc("palihue").set({palihueOpciones2});
   await db.collection("gastos_reset").doc("patricios").set({patriciosOpciones2});
   await db.collection("gastos_reset").doc("ragazzi").set({ragazziOpciones2});

}

//  MODIFICAR ALMANAQUE_LINEA MANUALMENTE
// =================
const modificarAlmanaque = async () => {
   await db.collection("almanaque_linea").doc("04").set({fechaPagado: '', date: '29-12', sector: 'patricios', rubro: 'FEDERADA', monto: '18856'});
   await db.collection("almanaque_linea").doc("10").set({fechaPagado: '', monto: '1900', sector: 'ragazzi', date: '29-12', rubro: 'SEGURO'});
}

//  MODIFICAR MESES MANUALMENTE
// =================
const modificarMes = async () => {

const aux = {
  "01": {date: '02-12', fechaPagado: '02-12', rubro: 'MASTER', sector: 'patricios', monto: '59011'},
  "02": {rubro: 'SUSS', monto: '72211', date: '02-12', fechaPagado: '02-12', sector: 'ragazzi'},
  "03": {date: '03-12', rubro: 'MONOT LI', fechaPagado: '03-12', monto: '1240', sector: 'jmolina'},
  "04": {monto: '1321', rubro: 'COMPL', sector: 'patricios', date: '03-12', fechaPagado: '03-12'},
  "05": {rubro: 'SUELDO G', date: '06-12', monto: '83862', sector: 'ragazzi', fechaPagado: '06-12'},
  "06": {fechaPagado: '06-12', sector: 'ragazzi', date: '06-12', monto: '70284', rubro: 'SUELDO R'},
  "07": {rubro: 'TRANSP B', date: '06-12', fechaPagado: '06-12', monto: '1085', sector: 'ragazzi'},
  "08": {date: '06-12', rubro: 'RENTAS', monto: '0', fechaPagado: '06-12', sector: 'palihue'},
  "09": {fechaPagado: '06-12', monto: '0', date: '06-12', sector: 'patricios', rubro: 'RENTAS'},
  "10": {sector: 'jmolina', fechaPagado: '06-12', date: '06-12', monto: '0', rubro: 'RENTAS'},
  "11": {monto: '0', rubro: 'PATENTE', fechaPagado: '06-12', date: '06-12', sector: 'jmolina'},
  "12": {fechaPagado: '06-12', monto: '3930', rubro: 'AUTON', sector: 'patricios', date: '06-12'},
  "13": {date: '06-12', fechaPagado: '06-12', sector: 'jmolina', rubro: 'LUZ', monto: '4133'},
  "14": {rubro: 'LUZ', fechaPagado: '06-12', date: '06-12', monto: '712', sector: 'patricios'},
  "15": {sector: 'patricios', monto: '0', rubro: 'PATENTE', date: '10-12', fechaPagado: '08-12'},
  "16": {fechaPagado: '08-12', date: '10-12', sector: 'patricios', rubro: 'COMPL MO', monto: '0'},
  "17": {date: '10-12', monto: '32826', sector: 'jmolina', rubro: 'FAVACARD', fechaPagado: '08-12'},
  "18": {fechaPagado: '08-12', monto: '2271', sector: 'ragazzi', rubro: 'TELEFONO', date: '10-12'},
  "19": {rubro: 'GAS', sector: 'ragazzi', date: '13-12', monto: '875', fechaPagado: '08-12'},
  "20": {rubro: 'CONTADOR', fechaPagado: '08-12', sector: 'ragazzi', date: '10-12', monto: '9500'},
  "21": {monto: '246', fechaPagado: '09-12', rubro: 'GAS', sector: 'patricios', date: '10-12'},
  "22": {fechaPagado: '09-12', monto: '0', date: '10-12', sector: 'patricios', rubro: 'GAS'},
  "23": {rubro: 'GAS', fechaPagado: '09-12', sector: 'jmolina', monto: '1874', date: '10-12'},
  "24": {sector: 'palihue', rubro: 'TELEFONO', fechaPagado: '09-12', date: '10-12', monto: '680'},
  "25": {monto: '2259', date: '10-12', sector: 'palihue', rubro: 'CABLE', fechaPagado: '09-12'},
  "26": {fechaPagado: '13-12', date: '23-12', rubro: 'IVA', monto: '62630', sector: 'ragazzi'},
  "27": {monto: '3000', fechaPagado: '13-12', sector: 'patricios', rubro: 'COCHERA', date: '10-12'},
  "28": {sector: 'ragazzi', date: '13-12', rubro: 'MUNI', fechaPagado: '13-12', monto: '6739'},
  "29": {monto: '1581', rubro: 'MUNI', date: '13-12', sector: 'patricios', fechaPagado: '13-12'},
  "30": {monto: '3577', date: '13-12', fechaPagado: '13-12', rubro: 'MUNI MO', sector: 'palihue'},
  "31": {rubro: 'MUNI', fechaPagado: '13-12', sector: 'palihue', monto: '3522', date: '13-12'},
  "32": {monto: '3067', date: '13-12', rubro: 'MUNI', fechaPagado: '13-12', sector: 'jmolina'},
  "33": {date: '13-12', rubro: 'VISA', monto: '12731', sector: 'patricios', fechaPagado: '13-12'},
  "34": {sector: 'patricios', date: '13-12', fechaPagado: '13-12', monto: '1075', rubro: 'MUNI MO'},
  "35": {rubro: 'MUNI MO', fechaPagado: '13-12', date: '13-12', sector: 'ragazzi', monto: '2462'},
  "36": {monto: '10263', date: '13-12', rubro: 'TRANSP A', sector: 'ragazzi', fechaPagado: '15-12'},
  "37": {date: '14-12', rubro: 'SINDICATO', monto: '9869', sector: 'ragazzi', fechaPagado: '15-12'},
  "38": {monto: '5217', sector: 'ragazzi', date: '20-12', fechaPagado: '15-12', rubro: 'LUZ'},
  "39": {sector: 'ragazzi', date: '23-12', fechaPagado: '15-12', rubro: 'TASA', monto: '9818'},
  "40": {fechaPagado: '15-12', rubro: 'AGUA', date: '21-12', sector: 'ragazzi', monto: '2364'},
  "41": {monto: '3546', date: '30-12', rubro: 'AGUA MO', fechaPagado: '15-12', sector: 'ragazzi'}
}

  Object.entries(aux).forEach( ([k, v]) => {
     db.collection("2021_12_diciembre").doc(k).set(v);
  });

}
*/
