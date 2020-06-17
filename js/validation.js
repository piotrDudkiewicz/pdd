document.addEventListener("DOMContentLoaded", () => {
     validation.initialize();
});

const validation = {
     formCommodity: document.getElementById("addCommodityForm"),
     rateGroup: document.getElementById("rate"),


     initialize: function () {
          const a = this.formCommodity.querySelectorAll("[required]");

          this.formCommodity.noValidate = true;

          this.validationState = [...a].reduce(function (temp, ele) {
               temp[ele.id] = false;
               return temp;
          }, {});

          this.formCommodity.addEventListener("submit", (e) => {
               e.preventDefault();

               for (let element in this.validationState) {
                    const ele = document.getElementById(element);
                    const error = (element == this.rateGroup.id) ? document.getElementById("errorForRate") : document.getElementById(element).nextElementSibling;
                    this.validationFun(ele, error);
               }

               let status = Object.keys(this.validationState).find((key) => {
                    return this.validationState[key] == false;
               }) != null ? false : true;

               this.data = null;

               if (status != false) {
                    this.data = new FormData(this.formCommodity);
               }

          });

          this.formCommodity.addEventListener("change", (e) => {
               const element = e.target;
               const error = element.nextElementSibling;

               if (element.required) {
                    this.validationFun(element, error);
               }

          }, true);

          this.rateGroup.addEventListener("change", () => {
               const error = document.getElementById("errorForRate");
               this.validationFun(this.rateGroup, error)
          }, true);

     },

     validationFun: function (element, error) {
          let state = "";

          switch (element.id) {
               case "codeCommodity":
                    state = this.codeCommodity(element);
                    break;
               case "nameCommodity":
                    state = this.nameCommodity(element);
                    break;
               case "priceNet":
                    state = this.priceNet(element);
                    break;
               case "vat":
                    state = this.vat(element);
                    break;
               case "category":
                    state = this.category(element);
                    break;
               case "options":
                    state = this.options(element);
                    break;
               case "photo":
                    state = this.photo(element);
                    break;
               case "rate":
                    state = this.rate(element)
                    break;
          }

          this.checkGood(state, error);

          if (state == true)
               this.validationState[element.id] = true;
          else
               this.validationState[element.id] = false;

     },

     checkGood: function (message, error) {

          if (message !== true) {
               error.innerHTML = message;
               error.classList.add("invalid-feedback");
               this.formCommodity.classList.add("is-invalid");
               error.classList.remove("valid-feedback");
               this.formCommodity.classList.remove("is-valid");
               error.style.setProperty("display", "block");
          } else {
               error.classList.remove("invalid-feedback");
               this.formCommodity.classList.remove("is-invalid");
               error.classList.add("valid-feedback");
               this.formCommodity.classList.add("is-valid")
               error.style.setProperty("display", "none");
               error.innerHTML = "";
          }
     },

     nameCommodity: function (element) {
          const value = element.value;
          let re = new RegExp('^[a-zA-Z]{1,}$');

          if (value === "") {
               return "To pole nie może być puste";
          } else if (value.length > 10) {
               return "Maksymalnie 10 znaków."
          } else if (re.test(value) == false) {
               return "Tylko litery."
          }

          return true;
     },

     codeCommodity: function (element) {
          const value = element.value;
          let re = new RegExp('^[A-Za-z0-9]{2}-[A-Za-z0-9]{2}$');

          if (value == "") {
               return "To pole nie może być puste";
          } else if (re.test(value) == false) {
               return "Popraw format [XX-XX], gdzie X to litery lub cyfry";
          }

          return true;
     },

     priceNet: function (element) {
          const value = element.value;

          if (value === "") {
               return "To pole nie może być puste";
          } else if (parseFloat(value) < 0) {
               return "Liczba nie może być mniejsza od zera.";
          }

          element.value = parseFloat(value).toFixed(2);
          this.changeBrutto();

          return true;
     },

     vat: function (element) {
          const value = element.value;

          if (value === "") {
               return "To pole nie może być puste";
          } else if (parseFloat(value) < 0) {
               return "Liczba nie może być mniejsza od zera.";
          }

          this.changeBrutto();

          return true;
     },

     category: function (element) {
          const value = element.options[element.selectedIndex].value;

          if (value === "0") {
               return "Wybierz jakąś kategorię."
          }

          return true;
     },

     options: function (element) {
          let count = element.querySelectorAll("option:checked").length;

          if (count < 2)
               return "Wybierz chociaż dwie opcję";

          return true;
     },
     photo: function (element) {
          const value = element.value;

          if (value === "") {
               return "Wypełnij to pole";
          }
          return true;
     },

     rate: function (element) {
          const allRadio = element.querySelectorAll('[name=rate]');

          for (let element of allRadio) {
               if (element.checked == true)
                    return true;
          }

          return "Wybierz jedną ocenę";
     },

     changeBrutto: function () {
          const price = parseFloat(document.getElementById('priceNet').value);
          const vat = parseFloat(document.getElementById('vat').value);

          if (price && vat)
               document.getElementById("priceBrut").value = (vat * price / 100) + price;
     }
}