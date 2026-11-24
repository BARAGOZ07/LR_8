const openButton = document.getElementById("openFeedback");

const closeButton = document.getElementById("closeFeedback");

const popup = document.getElementById("feedbackPopup");

const form = document.getElementById("feedbackForm");

const statusMessage = document.getElementById("formStatus");

const submitButton = form.querySelector(".submit-button");


// Адрес Formcarry

const FORM_URL = "https://formcarry.com/s/fzf0vXdf4fK";


// Ключ LocalStorage

const STORAGE_KEY = "feedbackFormData";


// Открытие формы

function openForm() {

    if (popup.classList.contains("active")) {
        return;
    }

    popup.classList.add("active");

    document.body.style.overflow = "hidden";

    history.pushState(
        { feedbackOpen: true },
        "",
        "#feedback"
    );

}


// Закрытие формы

function hideForm() {

    popup.classList.remove("active");

    document.body.style.overflow = "";

}


// Открытие по кнопке

openButton.addEventListener("click", function() {

    openForm();

});


// Закрытие по кнопке

closeButton.addEventListener("click", function() {

    if (popup.classList.contains("active")) {

        history.back();

    }

});


// Обработка кнопки Назад

window.addEventListener("popstate", function() {

    hideForm();

});


// Закрытие клавишей Escape

document.addEventListener("keydown", function(event) {

    if (
        event.key === "Escape" &&
        popup.classList.contains("active")
    ) {

        history.back();

    }

});


// Получение данных формы

function getFormData() {

    return {

        fullname: form.elements.fullname.value,

        email: form.elements.email.value,

        phone: form.elements.phone.value,

        organization: form.elements.organization.value,

        message: form.elements.message.value,

        consent: form.elements.consent.checked

    };

}


// Сохранение данных

function saveFormData() {

    const data = getFormData();

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
    );

}


// Восстановление данных

function restoreFormData() {

    const savedData = localStorage.getItem(STORAGE_KEY);

    if (!savedData) {
        return;
    }

    try {

        const data = JSON.parse(savedData);

        form.elements.fullname.value = data.fullname || "";

        form.elements.email.value = data.email || "";

        form.elements.phone.value = data.phone || "";

        form.elements.organization.value = data.organization || "";

        form.elements.message.value = data.message || "";

        form.elements.consent.checked = data.consent || false;

    }

    catch (error) {

        localStorage.removeItem(STORAGE_KEY);

    }

}


// Сохранение при вводе

form.addEventListener("input", saveFormData);

form.addEventListener("change", saveFormData);


// Восстанавливаем данные при загрузке

restoreFormData();


// Отправка формы

form.addEventListener("submit", async function(event) {

    event.preventDefault();

    statusMessage.textContent = "";

    statusMessage.style.color = "white";


    // Проверка согласия

    if (!form.elements.consent.checked) {

        statusMessage.textContent =
            "Необходимо согласиться на обработку персональных данных.";

        return;

    }

    // Проверка ФИО
const fullname = form.elements.fullname.value.trim();

if (!/^[А-Яа-яЁёA-Za-z\s-]+$/.test(fullname)) {
    statusMessage.textContent = "ФИО должно содержать только буквы.";
    return;
}

// Проверка телефона
const phone = form.elements.phone.value.trim();
const phoneDigits = phone.replace(/\D/g, "");

if (phoneDigits.length < 6 || phoneDigits.length > 15) {
    statusMessage.textContent = "Телефон должен содержать от 6 до 15 цифр.";
    return;
}

// Проверка организации
const organization = form.elements.organization.value.trim();

if (!/[А-Яа-яЁёA-Za-z]/.test(organization)) {
    statusMessage.textContent = "Название организации должно содержать хотя бы одну букву.";
    return;
}

// Проверка email
const email = form.elements.email.value.trim();

if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    statusMessage.textContent = "Введите корректный адрес электронной почты.";
    return;
}

    // Проверка адреса сервера

    if (FORM_URL.includes("XXXXXXXX")) {

        statusMessage.textContent =
            "Сначала необходимо указать адрес Formcarry.";

        statusMessage.style.color = "orange";

        return;

    }


    submitButton.disabled = true;

    submitButton.textContent = "Отправка...";


    try {

        const data = getFormData();


        // Отправка данных через Fetch API

        const response = await fetch(FORM_URL, {

            method: "POST",

            headers: {

                "Content-Type": "application/json",

                "Accept": "application/json"

            },

            body: JSON.stringify(data)

        });


        const result = await response.json();


        // Проверка ответа сервера

        if (!response.ok || result.code !== 200) {

            throw new Error("Ошибка отправки");

        }


        // Успешная отправка

        statusMessage.textContent =
            "Сообщение успешно отправлено!";

        statusMessage.style.color = "lightgreen";


        // Очищаем форму

        form.reset();


        // Удаляем данные из LocalStorage

        localStorage.removeItem(STORAGE_KEY);


    }

    catch (error) {

        statusMessage.textContent =
            "Ошибка отправки. Попробуйте ещё раз.";

        statusMessage.style.color = "red";

        console.error(error);

    }

    finally {

        submitButton.disabled = false;

        submitButton.textContent = "Отправить";

    }
});
