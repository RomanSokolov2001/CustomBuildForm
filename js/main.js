$(document).ready(function () {
    const inputIds = [];
    let counter = 0;

    // UTILS
    const checkFieldTypeSelect = () => {
        if ($("#text").prop("checked")) {
            $("#select-edit").hide();
        } else if ($("#select").prop("checked")) {
            $("#select-edit").show();
        }
    };

    const isEmptyOrSpaces = (str) => str.trim().length === 0;

    const clearInput = () => {
        $("#field-name").val("");
        $("#select-choices").empty();
    };

    // ELEMENTS
    const getRowEl = (id, values) => `
        <tr>
            <td>${id}</td>
            ${values.map((val) => `<td>${val}</td>`).join("")}
        </tr>
    `;

    const getOptionEl = (choice) => `<option value="${choice.trim()}">${choice.trim()}</option>`;

    const getInputEl = (fieldName) => `
    <li id="li-text-${fieldName}">
        <a>${fieldName}:</a>
        <input type="text" id="text-${fieldName}">
        <button class="small-btn delete-field-btn" data-field-id="text-${fieldName}" type="button">x</button>
    </li>
`;

    const getSelectorEl = (choices, fieldName) => `
    <li id="li-select-${fieldName}" class="select-field-container">
        <label>${fieldName}:</label>
        <div class="selector-container">
            <select id="select-${fieldName}">
                ${choices.map((choice) => getOptionEl(choice)).join("")}
            </select>
        </div>
        <button class="small-btn delete-field-btn" data-field-id="select-${fieldName}" type="button">x</button>
    </li>
`;

    const getCellEl = (fieldName) => `<th>${fieldName}</th>`;



    checkFieldTypeSelect();

    $("#input-fields").on("click", ".delete-field-btn", function () {
        const fieldId = $(this).data("field-id");
        const liId = `li-${fieldId}`;
        console.log(fieldId)
        console.log(inputIds)

        $(`#${liId}`).remove();
        const index = inputIds.indexOf(fieldId)
        if (index > -1) {
            inputIds[index] = ''
          } else {console.log('not found')}

    });

    $("input[type='radio'][name='field_type']").change(checkFieldTypeSelect);

    $("#add-choice-btn").click(function () {
        const choiceName = $("#choice-name").val();

        if (!isEmptyOrSpaces(choiceName)) {
            const newChoice = $("<li>").text(choiceName);
            const removeBtn = $("<button class=\"small-btn\">")
                .text("x")
                .click(function () {
                    $(this).parent().remove();
                });

            newChoice.append(removeBtn);
            $("#select-choices").append(newChoice);
            $("#choice-name").val("");
        }
    });

    $("#add-field-btn").click(function () {
        const fieldType = $("input[type='radio'][name='field_type']:checked").val();
        const fieldName = $("#field-name").val();
        const choices = [];

        if (isEmptyOrSpaces(fieldName)) return;

        if (fieldType === "Text") {
            $("#input-fields").append(getInputEl(fieldName));
            inputIds.push(`text-${fieldName}`);
        } else if (fieldType === "Select") {
            $("#select-choices li").each(function () {
                const choice = $(this).clone().children().remove().end().text();
                choices.push(choice);
            });

            if (choices.length === 0) return;

            $("#input-fields").append(getSelectorEl(choices, fieldName));
            inputIds.push(`select-${fieldName}`);
        }

        $("#table-headers").append(getCellEl(fieldName));
        clearInput();
    });

    $("#custom-form-btn").click(function () {
        if (inputIds.length === 0) return
        const values = [];
        counter++;

        inputIds.forEach((id) => {
            if (id.startsWith("text")) {
                const input = $(`#${id}`).val();
                values.push(input);
                document.getElementById(id).value = "";
            } else if (id.startsWith("select")) {
                const input = $(`#${id}`).val();
                values.push(input);
                document.getElementById(id).selectedIndex = 0;
            } else {
                values.push('');
            }
        });

        $("#data-table").append(getRowEl(counter, values));
    });
});
