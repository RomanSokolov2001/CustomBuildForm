$(document).ready(function () {
    const inputIds = [];
    let counter = 0;
    let tableData = {
        headers: ["id"],
        rows: []
    };

    const REGEX = /^[a-zA-Z0-9 ]+$/;
    const MAX_LENGTH = 50;

    const ELEMENTS = {
        fieldName: $('#field-name'),
        choiceName: $('#choice-name'),
        selectChoices: $('#select-choices'),
        inputFields: $('#input-fields'),
        tableHeaders: $('#table-headers'),
        table: $('#data-table'),
        addChoiceBtn: $('#add-choice-btn'),
        addFieldBtn: $('#add-field-btn'),
        customFormBtn: $('#custom-form-btn')
    }

    const RADIO = {
        fieldType: $('input[type="radio"][name="field_type"]')
    };

    const getChoicesFromInput = () => ELEMENTS.selectChoices.find('li').map((_, li) => $(li).text().trim().slice(0, -1)).get();


    const checkFieldTypeSelect = () => {
        if (RADIO.fieldType.filter('#select').prop("checked")) {
            $("#select-edit").show();
            $("#nullable-checkbox-container").hide();
        } else {
            $("#nullable-checkbox-container").show();
            $("#select-edit").hide();
        }
    };

    const isFieldAlreadyExists = (fieldName) => {
        return inputIds.includes(`text-${fieldName}`) ||
            inputIds.includes(`text-nullable-${fieldName}`) ||
            inputIds.includes(`select-${fieldName}`);
    };

    const isEmptyOrSpaces = (str) => {
        return !str || str.trim().length === 0;
    };
    const isValidTextInput = (text) => {
        return REGEX.test(text) && !(text.length > MAX_LENGTH)
    }

    const clearInputFields = () => {
        ELEMENTS.fieldName.val("");
        ELEMENTS.choiceName.val("");
        ELEMENTS.selectChoices.empty();
    };

    checkFieldTypeSelect();

    RADIO.fieldType.change(checkFieldTypeSelect);
    ELEMENTS.customFormBtn.click(handleNewEntry);
    ELEMENTS.addFieldBtn.click(handleNewField);
    ELEMENTS.inputFields.on("click", ".delete-field-btn", handleInputDeletion);
    ELEMENTS.addChoiceBtn.click(handleNewChoice);


    function handleNewChoice() {
        const choiceName = ELEMENTS.choiceName.val();
        if (!isEmptyOrSpaces(choiceName)) {
            const existingChoices = getChoicesFromInput()
            if (!isValidTextInput(choiceName) || existingChoices.includes(choiceName)) {
                return alert("Invalid input")
            }

            const newChoice = $("<li>").text(choiceName);
            const removeBtn = $("<button class='small-btn'>x</button>")
                .click(() => newChoice.remove());
            newChoice.append(removeBtn);

            ELEMENTS.selectChoices.append(newChoice);
            ELEMENTS.choiceName.val("")
        };
    };

    function handleNewField() {
        const fieldType = RADIO.fieldType.filter(':checked').val();
        const fieldName = ELEMENTS.fieldName.val().trim().replace(/\s+/g, '');

        if (isEmptyOrSpaces(fieldName)) return alert("Field name cannot be empty!");
        if (isFieldAlreadyExists(fieldName)) return alert("Field name already exists!");
        if (!isValidTextInput(fieldName)) return alert("Invalid input. Only A-B, 0-9 and max length is 50")


        if (fieldType === "Text") {
            const isNullable = $("input[type='checkbox'][name='nullable']").is(":checked");
            ELEMENTS.inputFields.append(textFieldMarkup(fieldName, isNullable));
            inputIds.push(`text-${isNullable ? "nullable-" : ""}${fieldName}`);

        } else if (fieldType === "Select") {
            const choices = getChoicesFromInput()

            if (!choices.length) return alert("Add at least one choice!");
            ELEMENTS.inputFields.append(selectFieldMarkup(choices, fieldName));
            inputIds.push(`select-${fieldName}`);
        }

        ELEMENTS.tableHeaders.append(thMarkup(fieldName));
        if (!tableData.headers.includes(fieldName)) {
            tableData.headers.push(fieldName)
        }
        clearInputFields();
    };

    function handleInputDeletion() {
        const fieldId = $(this).data("field-id");
        const liId = `li-${fieldId}`;
        $(`#${liId}`).remove();

        const index = inputIds.indexOf(fieldId);
        if (index !== -1) { inputIds.splice(index, 1) }
    };

    function handleNewEntry() {
        if (inputIds.length == 0) return alert("No fields to submit!");
        counter++;

        var row = [counter];
        for (let i = 1; i < tableData.headers.length; i++) {
            row.push("");
        }

        inputIds.forEach((inputId) =>  {
            console.log($(`#${inputId}`).val())
            const fileName = inputId.split("-").pop()
            const relativeIndex = tableData.headers.indexOf(fileName)
            const type = getType(inputId)
            const el = $(`#${inputId}`)
            const value = el.val()

            checkNull()
            if (relativeIndex === -1) {
                console.error(`Field name "${fileName}" not found in table headers.`);
                throw new Error(`Field "${fileName}" does not exist in headers.`);
            }
            row.splice(relativeIndex, 1, value)


            resetValues()

            function resetValues() {
                if (type === "select") {
                    el.prop("selectedIndex", 0);
                } else {
                    el.val("");
                }
            }

            function checkNull() {
                if (type == "text" && isEmptyOrSpaces(value)) {
                    alert("Required text field cannot be empty!");
                    throw new Error("Validation Error");
                }
            }

            function getType(fieldId) {
                if (fieldId.startsWith("select")) return "select"
                if (fieldId.startsWith("text-nullable")) return "text-nullable"
                return "text"
            }

        })
        tableData.rows.push(row)
        drawTable()
    }

    const drawTable = () => {
        ELEMENTS.table.empty();

        const headersMarkup = tableData.headers.map(value => `<th>${value}</th>`).join('');
        ELEMENTS.table.append(`<tr>${headersMarkup}</tr>`);

        if (tableData.rows.length > 0) {
            const rowsMarkup = tableData.rows.map((row, index) => {
                const rowMarkup = row.map(value => `<td>${value}</td>`).join('');
                return `<tr>${rowMarkup}</tr>`;
            }).join('');

            ELEMENTS.table.append(rowsMarkup);
        } else {
            ELEMENTS.table.append('<tr><td colspan="100%">No data available</td></tr>');
        }
    };

    const textFieldMarkup = (fieldName, nullable) => `
        <li id="li-text-${nullable ? "nullable-" : ""}${fieldName}">
            <a>${fieldName}:</a>
            <input type="text" id="text-${nullable ? "nullable-" : ""}${fieldName}">
            <button class="small-btn delete-field-btn" data-field-id="text-${nullable ? "nullable-" : ""}${fieldName}" type="button">x</button>
        </li>
    `;

    const selectFieldMarkup = (choices, fieldName) => `
        <li id="li-select-${fieldName}" class="select-field-container">
            <label>${fieldName}:</label>
            <div class="selector-container">
                <select id="select-${fieldName}">
                    ${choices.map((choice) => `<option value="${choice.trim()}">${choice.trim()}</option>`).join("")}
                </select>
            </div>
            <button class="small-btn delete-field-btn" data-field-id="select-${fieldName}" type="button">x</button>
        </li>
    `;

    const thMarkup = (fieldName) => `<th>${fieldName}</th>`;
});