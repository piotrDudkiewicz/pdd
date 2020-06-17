$(document).ready(function () {
     let isEdit = false;
     readDataFromJSON();

     $('#koszykOpen').click(function (event) {
          const elemInKoszyk = JSON.parse(localStorage.getItem('koszyk'));
          const koszyk = $("#koszyk .table tbody");
          $(koszyk).empty();
          $('#sum').empty();

          if (elemInKoszyk) {
               const iloscProduktow = elemInKoszyk.length;
               let cenaSumaryczna = 0;

               if (elemInKoszyk != null) {
                    elemInKoszyk.forEach((ele) => {
                         let tr = $('<tr></tr>');
                         ["nameCommodity", "priceBrut"].forEach(function (key) {
                              if (key == "priceBrut")
                                   cenaSumaryczna += parseFloat(ele[key]);
                              tr.append($('<td class="' + key + '"></td>').text(ele[key]));
                         });
                         tr.append($('<td><input class="iloscKoszyk" type="number" min="0" value="1"></td>'));
                         koszyk.append(tr);
                    });
                    cenaSumaryczna += 10;
               }
               $('#sum').html("Ilość: " + iloscProduktow + " Cena Sumaryczna: " + '<span id="cenaSumaryczna" >' + cenaSumaryczna + "</span>");
          }

     });

     $('#zaplac').click(function (event) {
          $('#koszyk').modal('hide')
          localStorage.removeItem('koszyk');
     });


     $("form").submit(function (event) {
          let tab = "";

          let isInTable = $.inArray($('#nameCommodity').val(), $('table .nameCommodity').map(function () {
               return $.trim($(this).text());
          }).get());

          if ((validation.data != null && isInTable == -1) || (validation.data != null && isEdit != false && isInTable > -1)) {
               let x = 0;
               let tr = isEdit != false ? $('table .nameCommodity').filter(function () {
                    return $.trim($(this).text()) == isEdit;
               }).closest('tr') : $('<tr></tr>');

               let a = isEdit != false ? true : false;

               $(tr).empty();
               isEdit = false;
               let temp = null;

               for (let value of validation.data.entries()) {
                    if (value[0] == "options" && x != 0) {
                         $(temp).text($(temp).text() + ", " + value[1])
                    } else if (value[0] == "options") {
                         x++;
                         temp = $('<td class="' + value[0] + '"></td>').text(value[1]);
                    } else if (value[0] == "file") {
                         temp = $('<td class="' + value[0] + '"></td>').text(value[1].name);
                    } else if (value[0] == "nameCommodity") {
                         temp = $('<td class="' + value[0] + '"></td>').text(value[1]);
                    } else {
                         temp = $('<td class="' + value[0] + '"></td>').text(value[1]);
                    }
                    $(tr).append(temp);
               }
               temp = $('<td></td>');
               $('<input type="button" class="deleteTable" value="usun"/>').appendTo(temp);
               $('<input type="button" class="editTable" value="edytuj"/>').appendTo(temp);
               $('<input type="button" class="addTable" value="dodaj do koszyka"/>').appendTo(temp);
               $(tr).append(temp);
               $('#myTable tbody').append(tr)
               $('#myTable').trigger('addRows', [tr, true]);
               validation.data = null;
               $('#formButton').val('Wyślij');
          }
     });

     $("#myTable").tablesorter({

          headers: {
               '.disable': {
                    sorter: false
               }
          }
     });


     $("#sortOption").change(function () {

          const val = $("#sortOption option:selected").val();
          let action;

          switch (val) {
               case "1":
                    action = [
                         [
                              [4, 0]
                         ]
                    ];
                    break;
               case "2":
                    action = [
                         [
                              [4, 1]
                         ]
                    ];
                    break;
               case "3":
                    action = [
                         [
                              [7, 0]
                         ]
                    ];
                    break;
               case "4":
                    action = [
                         [
                              [7, 1]
                         ]
                    ];
                    break;
               case "5":
                    action = [
                         [
                              [0, 0]
                         ]
                    ];
                    break;
               case "6":
                    action = [
                         [
                              [0, 1]
                         ]
                    ];
                    break;
          }
          $("#myTable").trigger("sorton", action);
     });
     $('#myTable').delegate('.editTable', 'click', function () {
          isEdit = $(this).closest('tr').find('.nameCommodity').text();
          let t = $('#addCommodityForm');
          let elements = $(this).closest('tr').find('td');
          $('#formButton').val('Edytuj');


          for (let element of elements) {
               if (element.className) {
                    let formEl = t.find("#" + element.className);
                    switch (element.className) {
                         case "options":
                              let vals = element.textContent.split(",");
                              vals = vals.map(e => e.trim());
                              formEl.val(vals);
                              break;
                         case "rate":
                              formEl.find('[value=' + element.textContent + ']').prop("checked", true);
                              break;
                         default:
                              formEl.val(element.textContent);
                              break;
                    }
               }
          }
     });

     $('#myTable').delegate('.deleteTable', 'click', function () {
          $(this).closest('tr').remove();
          $('#myTable').trigger('update');
          alert('Usunięto!');
     });

     $('#tableKoszyk').delegate('.iloscKoszyk', 'blur', function () {
          const itemsInBucket = $(this).closest('tbody').find('tr');

          if ($(this).val() < 0) {
               $(this).val("0");
          }

          fullSum();
     });

     $('#koszyk').delegate('#dostawa', 'blur', function () {
          fullSum();
     });

     $('#myTable').delegate('.addTable', 'click', function () {
          const tr = $(this).closest('tr').find('td');

          let temp = JSON.parse(localStorage.getItem('koszyk'));

          let nameCommodity = $(this).closest('tr').find('.nameCommodity').text();

          let numberOfElementsInStorage = 0;

          let isInTable;

          if (temp != null) {
               isInTable = temp.find(function (a) {
                    return a["nameCommodity"] == nameCommodity;
               });
               numberOfElementsInStorage = temp.length;
          } else {
               temp = new Array();
          }
          if (isInTable === undefined) {
               temp[numberOfElementsInStorage] = new Object();

               for (let element of tr) {
                    if (element.textContent != "")
                         temp[numberOfElementsInStorage][element.className] = element.textContent;
               }
               localStorage.setItem('koszyk', JSON.stringify(temp));
               $('#myTable').trigger('update');
               alert('Dodano do koszyka.');
          } else {
               alert('Ten produkt już jest w koszyku.');
          }

     });
});


function fullSum() {
     const itemsInBucket = $("#tableKoszyk").find('tbody tr');

     let sum = 0;

     for (let element of itemsInBucket) {
          const elementPrice = $(element).find('.priceBrut').text();
          const elementNumber = $(element).find('.iloscKoszyk').val();
          sum += (elementPrice * elementNumber);
     }

     sum += parseInt($('#dostawa').val());
     $("#cenaSumaryczna").text(sum.toFixed(2));
}

function readDataFromJSON() {
     $.get("../data/products.json", function (data) {
          for (let element of data) {
               let tr = $('<tr role="row"></tr>');
               for (let field in element) {
                    if (field == "file") {
                         $(tr).append($('<td class="' + field + ' col-2"><img class="commodityPicture" src="' + element[field] + '"></img></td>'));
                         continue;
                    }
                    $(tr).append($('<td class="' + field + '"></td>').text(element[field]));
               }
               let temp = $('<td></td>');
               $('<input type="button" class="deleteTable" value="usun"/>').appendTo(temp);
               $('<input type="button" class="editTable" value="edytuj"/>').appendTo(temp);
               $('<input type="button" class="addTable" value="dodaj do koszyka"/>').appendTo(temp);
               $(tr).append(temp);
               $("#myTable tbody").append(tr);
               $('#myTable').trigger('addRows', [tr, true]);
          }

     });
}