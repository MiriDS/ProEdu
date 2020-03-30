
const requestType = {
    post:"post",
    get:"get",
    put:"put",
    delete:"delete"
};
const API_URL = "https://educore.pronet.az/v1/";

function logout() {
    localStorage.clear();
    location.href = "auth-login.html";
}


if(typeof localStorage.accessToken != 'undefined' && typeof localStorage.tenantInfo == 'undefined') {
    logout();
}

if(typeof localStorage.tenantInfo == 'undefined')
    var tenantInformation = {};
else
    var tenantInformation = JSON.parse(localStorage.tenantInfo);



var personInfo = {};

function getUserInformation() {

    if(typeof localStorage.personInfo == "undefined") {

        standartRequest(requestType.get,'profiles','',function(data) {

            personInfo = data;
            personInfo.lastname = personInfo.lastname==null?'':personInfo.lastname;
            //localStorage.personInfo = JSON.stringify(personInfo);
            initUserInformation();

        });
    }
    else {
        personInfo = JSON.parse(localStorage.personInfo);
        initUserInformation();
    }


}



function standartRequest(type,link,form_data,success_process) {

    if(type!="get") {
        form_data = form_data!=''?JSON.stringify(form_data):'';
    }

    var systemToken = localStorage.accessToken;


    var headers = {
        "X-AUTH-PROTOKEN":systemToken,
        "X-TENANT-ID": tenantInformation.id
    };
    if(type=="post" || type=="put") {
        headers = {
            "X-AUTH-PROTOKEN":systemToken,
            "X-TENANT-ID": tenantInformation.id,
            "Content-Type": "application/json"
        };
    }


    $.ajax({
        url: API_URL+link,
        type: type,
        data: form_data ,
        headers: headers,
        statusCode: {
            401: function(responseObject, textStatus, jqXHR) {
                logout();
            },
            /*200: function (data) {
                success_process(data['data']);
            },
            201: function (data) {
                success_process(data['data']);
            },
            204: function (data) {
                success_process();
            }*/
        },
        success: function (data) {
            if(typeof data != 'undefined' && typeof data['data'] != 'undefined') {
                success_process(data['data']);
            }
            else {
                success_process({});
            }
        },
        error: function(data) {
            var data = data['responseJSON'];
            if(typeof data['error'] != "undefined") {
                alert(data['error']['message'], {});
            }
        }
    });
}


function ArrayToJson(form_data) {
    data = {};
    $(form_data).each(function(index, obj){
        data[obj.name] = obj.value;
    });
    return data;
}


function modalEmpty(modalId,callBackFuncName) {

    $("#"+modalId).find('[name]:disabled').removeAttr("disabled");
    $("#"+modalId).find('[name]').each(function() {
        $(this).val('');
    });
    if(typeof callBackFuncName != 'undefined') {
        var fn = window[callBackFuncName];
        if(typeof fn === 'function') {
            fn();
        }
    }
}


/**
 * Notify Addon definition as jQuery plugin
 * Adapted version to work with Bootstrap classes
 * More information http://getuikit.com/docs/addons_notify.html
 */

(function() {

    var containers = {},
        messages = {},

        notify = function(options) {

            if ($.type(options) == 'string') {
                options = { message: options };
            }

            if (arguments[1]) {
                options = $.extend(options, $.type(arguments[1]) == 'string' ? { status: arguments[1] } : arguments[1]);
            }

            return (new Message(options)).show();
        },
        closeAll = function(group, instantly) {
            if (group) {
                for (var id in messages) { if (group === messages[id].group) messages[id].close(instantly); }
            } else {
                for (var id in messages) { messages[id].close(instantly); }
            }
        };

    var Message = function(options) {

        var $this = this;

        this.options = $.extend({}, Message.defaults, options);

        this.uuid = "ID" + (new Date().getTime()) + "RAND" + (Math.ceil(Math.random() * 100000));
        this.element = $([
            // alert-dismissable enables bs close icon
            '<div class="uk-notify-message alert-dismissable">',
            '<a class="close">&times;</a>',
            '<div>' + this.options.message + '</div>',
            '</div>'

        ].join('')).data("notifyMessage", this);

        // status
        if (this.options.status) {
            this.element.addClass('alert alert-' + this.options.status);
            this.currentstatus = this.options.status;
        }

        this.group = this.options.group;

        messages[this.uuid] = this;

        if (!containers[this.options.pos]) {
            containers[this.options.pos] = $('<div class="uk-notify uk-notify-' + this.options.pos + '"></div>').appendTo('body').on("click", ".uk-notify-message", function() {
                $(this).data("notifyMessage").close();
            });
        }
    };


    $.extend(Message.prototype, {

        uuid: false,
        element: false,
        timout: false,
        currentstatus: "",
        group: false,

        show: function() {

            if (this.element.is(":visible")) return;

            var $this = this;

            containers[this.options.pos].show().prepend(this.element);

            var marginbottom = parseInt(this.element.css("margin-bottom"), 10);

            this.element.css({ "opacity": 0, "margin-top": -1 * this.element.outerHeight(), "margin-bottom": 0 }).animate({ "opacity": 1, "margin-top": 0, "margin-bottom": marginbottom }, function() {

                if ($this.options.timeout) {

                    var closefn = function() { $this.close(); };

                    $this.timeout = setTimeout(closefn, $this.options.timeout);

                    $this.element.hover(
                        function() { clearTimeout($this.timeout); },
                        function() { $this.timeout = setTimeout(closefn, $this.options.timeout); }
                    );
                }

            });

            return this;
        },

        close: function(instantly) {

            var $this = this,
                finalize = function() {
                    $this.element.remove();

                    if (!containers[$this.options.pos].children().length) {
                        containers[$this.options.pos].hide();
                    }

                    delete messages[$this.uuid];
                };

            if (this.timeout) clearTimeout(this.timeout);

            if (instantly) {
                finalize();
            } else {
                this.element.animate({ "opacity": 0, "margin-top": -1 * this.element.outerHeight(), "margin-bottom": 0 }, function() {
                    finalize();
                });
            }
        },

        content: function(html) {

            var container = this.element.find(">div");

            if (!html) {
                return container.html();
            }

            container.html(html);

            return this;
        },

        status: function(status) {

            if (!status) {
                return this.currentstatus;
            }

            this.element.removeClass('alert alert-' + this.currentstatus).addClass('alert alert-' + status);

            this.currentstatus = status;

            return this;
        }
    });

    Message.defaults = {
        message: "",
        status: "normal",
        timeout: 5000,
        group: null,
        pos: 'top-center'
    };


    $["notify"] = notify;
    $["notify"].message = Message;
    $["notify"].closeAll = closeAll;

    return notify;

}());


const getCurrentWeekDays = () => {
    const weekStart = moment().startOf('isoWeek');

    const days = [];
    for (let i = 0; i <= 6; i++) {
        days.push(moment(weekStart).add(i, 'days'));
    }

    return days;
}