document.write('<script type="text/javascript" src="../_cv_js/cordova.js"></' + 'script>');
document.write('<script type="text/javascript" src="js/_cv_lib.js?' + Math.random() + '"></' + 'script>');

document.addEventListener("deviceready", onDeviceReady, false);
document.addEventListener('DOMContentLoaded', DOMContentLoaded, false);

function onDeviceReady() {
  _cv_lib_val.onDeviceReady = true;
  loading();
}

function DOMContentLoaded() {
  _cv_lib_val.DOMContentLoaded = true;
  loading();
}

var _cv_server_url = false;

var par = [];
//par.url_server='http://www.button.red/';
par.url_server = 'http://page.chime.events/';
par.notification_interval = 5000;

par.url_api = 'DSService/api/';
par.url_image_event = 'PSAVDSWeb/Upload/Event/';
par.url_image_issue = 'PSAVDSWeb/Upload/Issue/';

par.api = [];
par.api.getversion = 'DS/CheckLatestVersion/';
par.api.login = 'Login/Login/';
par.api.getroomdetails = 'DS/GetRoomDeatailsByRoomID/';
par.api.getnotification = 'DS/GetNotifications/';
par.api.resetnotification = 'DS/SetNotfications/';
par.api.sendissue = 'DS/SaveIssueRequest/';
par.api.getevents = 'DS/GetEventsByCenter/';
par.api.getissues = 'DS/GetIssuessByRoomEvent/';


par.cfg = [];

function loading() {
  if (typeof (_cv_skip_cordova) == 'undefined') { //wait for dom & cordova ready
    if (_cv_lib_val.DOMContentLoaded && _cv_lib_val.onDeviceReady) {
      loading_device();
    }
  } else {
    loading_generic();
  }
}

function loading_generic() {
  api_login();
}

function loading_device() {
  _cv_get_json('page_par', function () {
    console.log('user:', _cv_lib_val.page_par.user);
    if (!_cv_lib_val.page_par.user) {
      par.cfg.user = "user_18_1";
      par.cfg.password = "password";
      show_login();
    } else {
      par.cfg.user = _cv_lib_val.page_par.user;
      par.cfg.password = _cv_lib_val.page_par.password;
      api_login(_cv_lib_val.page_par.user, _cv_lib_val.page_par.password);
    }
  });


  _cv_disable_sleep();
  //_cv_set_brightness(1);
  _cv_get_reset_switch(function (rtn) {
    _cv_set_reset_switch(false);
  });
  document.addEventListener("backbutton", function (e) {
    e.preventDefault();
  }, false);
}

function show_login(error) {
  $('.login-btn').removeClass('disabled');
  var txt = '<span class="window_body">';
  txt += '<div class="title">Login</div>';
  if (error) {
    txt += '<div id="login_msg">Unable to login</div>';
  }
  txt += '<div class="input-group"><label>User</label><input type="text" id="login_user" value="' + par.cfg.user + '"/></div>';
  txt += '<div class="input-group"><label>Password</label><input type="text" id="login_pass" value="' + par.cfg.password + '"/></div>';
  txt += '<div class="spacer"></div>';
  txt += '<div class="input-group"><span class="login-btn" onclick="submit_login();">Login</span></div>';
  txt += '</span>';
  open_window(txt);
}

function submit_login() {
  $('.login-btn').addClass('disabled');
  par.cfg.user = $('#login_user').val();
  par.cfg.password = $('#login_pass').val();
  $('#login_msg').html('');
  api_login();
}

function api_login() {
  $.ajax({
    url: par.url_server + par.url_api + par.api.login,
    type: "POST",
    dataType: "json",
    data: {
      "EmailAddress": par.cfg.user,
      "Password": par.cfg.password
    },
    success: function (data) {
      par.cfg.EmployeeIdNumber = data.EmployeeIdNumber;
      par.cfg.RoomID = data.RoomID;
      api_getroomdetails();
      _cv_lib_val.page_par.user = par.cfg.user;
      _cv_lib_val.page_par.password = par.cfg.password;
      _cv_save_json('page_par');
      close_window();
    },
    error: function (data) {
      show_login(true)
    }
  });
}

function api_getroomdetails() {
  $.ajax({
    url: par.url_server + par.url_api + par.api.getroomdetails,
    type: "POST",
    dataType: "json",
    data: {
      "RoomID": par.cfg.RoomID
    },
    success: function (data) {
      par.cfg.CenterID = data[0].CenterID;
      par.cfg.EventImage = data[0].EventImage;
      par.cfg.EventID = data[0].EventID;
      par.cfg.RoomName = data[0].RoomName;
      $('#room-name').text(par.cfg.RoomName);
      $('#result').append('<div class="event_image"><img src="' + par.url_server + par.url_image_event + par.cfg
      .EventImage + '"></div>');
      $('#result').append(
        '<div class="header_text">In-Room assistance needed?</br>Select from the options below.</div>');
      api_getissues();
    },
    error: post_error
  });
}

function api_getevents() {
  $.ajax({
    url: par.url_server + par.url_api + par.api.getevents,
    type: "POST",
    dataType: "json",
    data: {
      "CenterID": 1
    },
    success: function (data) {
      $('#result').append('<br/><br/>api_getevents<div>' + JSON.stringify(data, null, 2) + '</div>');
    },
    error: post_error
  });
}

function api_getissues() {
  $.ajax({
    url: par.url_server + par.url_api + par.api.getissues,
    type: "POST",
    dataType: "json",
    data: {
      "RoomID": par.cfg.RoomID,
      "EventID": par.cfg.EventID
    },
    success: function (data) {
      par.cfg.Issues = [];
      var cnt = 0;
      var issues_container = document.createElement('DIV');
      issues_container.classList.add('issues-container');
      for (var issue in data) {
        var val = [];
        val.IssueID = data[issue].IssueID;
        val.IssueImage = data[issue].IssueImage;
        val.IssueType = data[issue].IssueType;
        val.SpecifyIssue = data[issue].SpecifyIssue;
        par.cfg.Issues.push(val);
        var txt = '<div class="btn_issue" onclick="click_issue(' + cnt + ');">' +
          '<div class="img_issue" style="background-image: url('+par.url_server + par.url_image_issue + val.IssueImage+')"></div>' +
          '<div class="btn_label">' + val.IssueType + '</div>' +
          '</div>';

        issues_container.innerHTML += txt;

        cnt++;
      }
      $('#result').append(issues_container);
      getnotification_interval();
    },
    error: post_error
  });
}

function getnotification_interval() {
  if (par.not_intv) {
    window.clearInterval(par.not_intv);
    par.not_intv = false;
  }
  par.not_intv = setInterval(function () {
    api_getnotification();
  }, par.notification_interval);
  api_getnotification();
}

function api_getnotification() {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", par.url_server + par.url_api + par.api.getnotification, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.overrideMimeType("text/plain");
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        if (!par.open_window) {
          var notifications = JSON.parse(xhr.response);
          var txt = '<div class="window_body">';
          var notarr = [];

          console.log('notifications',notifications);
          for (var c in notifications) {
            var val = notifications[c];

            var val_details = val.Description.split(':');

            txt += '<div id="issue_id_' + val.NotificationID + '"><div id="tech-name"><span>Technician:</span> ' + val_details[0] + '</div>';
            txt += '<div id="issue-ref"><span>Issue:</span><br>' + val.Details + '</div>';
            txt += '<div id="tech-message"><span>Message:</span><br>' + val_details[1].trim() + '</div>';
            txt += '</div><br/>';
            notarr.push(val.NotificationID);
          }
          txt += '<div class="spacer"></div>';
          txt += '<div class="footer-btn-wrapper">';
          txt += '<div class="btn btn-primary" onclick="confirm_notifications(' + JSON.stringify(notarr) +
            ');">Confirm</div>';
          txt += '</span></div>';
          open_window(txt);
        }
      }
    }
  };
  xhr.send(JSON.stringify({
    "RoomID": par.cfg.RoomID
  }));
}

function confirm_notifications(notifications) {
  for (var id in notifications) {
    api_setNotfication(notifications[id]);
  }
  close_window();
}

function api_setNotfication(id) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", par.url_server + par.url_api + par.api.resetnotification, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {}
    }
  };
  xhr.send(JSON.stringify({
    "NotificationID": id
  }));
}

function click_issue(id) {
  val = par.cfg.Issues[id];
  var txt = '<div class="window_body">' +
    '<div class="title">Submit Issue</div>'+
    '<div class="floating-close-btn" onclick="close_window();"><i class="fa fa-times" aria-hidden="true"></i></div>'+
    '<div class="issue-icon"><img src="' + par.url_server + par.url_image_issue + val.IssueImage + '"></div>' +
    '<div class="issue-label">' + val.IssueType + '</div>';

  if (val.SpecifyIssue) {
    txt += '<div>Specify Issue</div>';
    txt += '<div class="input-group"><textarea id="issue_text" rows="3"></textarea></div>';
    txt += '<div class="spacer"></div>';
    txt += '<div class="btn btn-alert" onclick="send_issue(' + id + ');">JUST SEND HELP</div>';
    txt += '<div class="footer-btn-wrapper">';
    txt += '<div class="btn btn-primary" onclick="send_issue(' + id + ',$(\'#issue_text\').val());">Confirm</div>';
  } else {
    txt += '<div class="spacer"></div>';
    txt += '<div class="footer-btn-wrapper">';
    txt += '<div class="btn btn-primary" onclick="send_issue(' + id + ');">Confirm</div>';
  }

  txt += '<div class="btn btn-grey" onclick="close_window();">Cancel</div>';
  txt += '</div>';
  txt += '</span>';
  open_window(txt);
}

function send_issue(id, txt) {
  val = par.cfg.Issues[id];
  if (!txt) {
    txt = "";
  }
  var xhr = new XMLHttpRequest();
  xhr.open("POST", par.url_server + par.url_api + par.api.sendissue, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        open_window_message('Issue Submitted!');
      } else {
        open_window_error('There was a problem completing your request. Please try again.');
      }
    }
  };
  xhr.send(JSON.stringify({
    "RoomID": par.cfg.RoomID,
    "EventID": par.cfg.EventID,
    "IssueID": val.IssueID,
    "Description": txt
  }));
  close_window();
}

function open_window_message(msg) {
  var txt = '<span class="window_body">';
  txt += '<div class="msg-label success">' + msg + '</div>';
  txt += '<div class="spacer"></div>';
  txt += '<div class="footer-btn-wrapper">';
  txt += '<div class="btn btn-grey" onclick="close_window();">CLOSE</div>';
  txt += '</div>';
  txt += '</span>';
  open_window(txt);
}

function open_window_error(msg) {
  var txt = '<span class="window_body">';
  txt += '<div class="msg-label fail" style="color:red;">' + msg + '</div>';
  txt += '<div class="footer-btn-wrapper">';
  txt += '<div class="btn btn-grey" onclick="close_window();">CLOSE</div>';
  txt += '</span></div>';
  open_window(txt);
}

function open_window(txt) {
  $('#dark').show();
  $('#window').html(txt).show();
  par.open_window = true;
  //var tp=(window.innerHeight-$('#window .window_body').outerHeight())/2;
  var tp = 50;
  $('#window .window_body').css('top', tp);
}

function close_window() {
  $('#dark').hide();
  $('#window').hide();
  par.open_window = false;
}

function post_error(jqXHR, textStatus, errorThrown) {
  console.log(textStatus);
}

function toggle_info(){
  $('.info-container').toggleClass('active');
}
