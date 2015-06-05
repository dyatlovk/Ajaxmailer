(function ($) {
    jQuery.fn.AjaxMail = function (options) {

        // Defaults options
        options = $.extend({
            requestType: "POST", // POST или GET
            handlerURL: "mailer/cloack.php", // путь до обработчика
            sucessContaner: ".result" // куда передавать ответ сервера? Должен находится внутри "этого" обьекта

        }, options);


        var make = function () {

            // Берем наш обьект и сабмитим
            // предварительно ошибок нет

            $(this).submit(function () {
                var form = $(this);
                var error = false;

                form.find('input').each(function () { // пробежим по каждому полю в форме
                    if ($(this).val() == '') { // если находим пустое
                        $(this).addClass("error").attr('placeholder'); // добавляем класс ошибки
                        error = true; // ошибка
                    }
                    else {
                        $(this).removeClass("error").attr('placeholder');  // если поле заполнили, убираем класс ошибки
                    }
                });

                if (!error) { // если ошибки нет
                    var data = form.serialize(); // подготавливаем данные
                    $.ajax({ // инициализируем ajax запрос
                        type: options.requestType,
                        url: options.handlerURL,
                        dataType: 'json', // ответ ждем в json формате
                        data: data, // данные для отправки
                        cache: false,

                        beforeSend: function (data) { // событие до отправки
                            form.find('button[type="submit"]').attr('disabled', 'disabled'); // например, отключим кнопку, чтобы не жали по 100 раз
                        },

                        success: function (data) { // событие после удачного обращения к серверу и получения ответа
                            if (data['error']) { // если обработчик вернул ошибку
                                console.log(data['error']); // покажем её текст
                            }
                            else { // если все прошло ок
                                console.log(data);
                                $(options.sucessContaner).fadeIn("slow");
                                $(".close").click(function () {
                                    $(options.sucessContaner).fadeOut("slow");
                                });
                                // Сбросим значения инпутов в исходное состояние
                                form[0].reset();
                            }
                        },

                        error: function (xhr, ajaxOptions, thrownError) { // в случае неудачного завершения запроса к серверу
                            console.log(xhr.status); // покажем ответ сервера
                            console.log(thrownError); // и текст ошибки
                        },

                        complete: function (data) { // событие после любого исхода
                            form.find('button[type="submit"]').prop('disabled', false); // в любом случае включим кнопку обратно
                        }

                    });
                }
                return false; // вырубаем стандартную отправку формы

            }); // конец сабмиту

        }; // помечу функцию make

        return this.each(make);
    };
})(jQuery);