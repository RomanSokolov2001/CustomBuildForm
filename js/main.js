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

    const getInputEl = (fieldName) => `
        <li id="text-${fieldName}">
            <a>${fieldName}:</a>
            <input type="text" id="text-${fieldName}">
            <button class="small-btn delete-field" data-field="${fieldName}">x</button>
        </li>
    `;

    const getOptionEl = (choice) => `<option value="${choice.trim()}">${choice.trim()}</option>`;

    const getSelectorEl = (choices, fieldName) => `
        <li id="select-${fieldName}" class="select-field-container">
            <label>${fieldName}:</label>
            <div class="selector-container">
                <select id="select-${fieldName}">
                    ${choices.map((choice) => getOptionEl(choice)).join("")}
                </select>
            </div>
            <button class="small-btn delete-field" data-field="${fieldName}">x</button>
        </li>
    `;

    const getCellEl = (fieldName) => `<th id="header-${fieldName}">${fieldName}</th>`;

    const removeColumn = (fieldName) => {
        // Remove the header
        $(`#header-${fieldName}`).remove();
        // Remove the input field
        $(`#field-${fieldName}`).remove();
        // Remove the column from the rows
        $("#data-table tr").each(function () {
            $(this).find(`td[data-field="${fieldName}"]`).remove();
        });
        // Remove field from tracking
        const index = inputIds.indexOf(fieldName);
        if (index > -1) inputIds.splice(index, 1);
    };

    checkFieldTypeSelect();

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

    $(document).on("click", ".delete-field", function () {
        const fieldName = $(this).data("field");
        removeColumn(fieldName);
    });

    $("#custom-form-btn").click(function () {
        if (inputIds.length === 0) return;
        var values = [];
        counter++;

        inputIds.forEach((id) => {
            if (id.startsWith("text")) {
                const input = $(`#${id}`).val();
                values.push(input);
                console.log(`input: ${input}`)
                document.getElementById(id).value = "";
            } else {
                const input = $(`#${id}`).val();
                values.push(input);
                console.log(`input: ${input}`)
                document.getElementById(id).selectedIndex = 0;
            }
        });
        console.log(inputIds)
        console.log(values)


        const rowHtml = `<tr>
            <td>${counter}</td>
            ${values
                .map((val, i) => `<td data-field="${inputIds[i].split("-")[1]}">${val}</td>`)
                .join("")}
        </tr>`;
        $("#data-table").append(getRowEl(counter, values));
    });
});
