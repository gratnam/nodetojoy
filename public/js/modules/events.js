angular.module('dibs.events', ['ui.bootstrap'])
  .constant('moment', moment)
  .controller('eventsController', function($scope, $state, eventModel, googleCalModel, moment, $interval, $window, $http) {
    $scope.eve = {};
    $scope.eve.eventDate = '';
    $scope.eve.eventEndDate = '';
    $scope.eve.eventDescription = '';
    $scope.eve.eventAlert = '';
    $scope.eve.eventTime = '';
    $scope.eve.eventEndTime = '';
    $scope.eve.roomName = '';
    $scope.eve.user = 'SimonTestForBrandon';
    $scope.eve.houseName = 'Hacker House';
    $scope.user_profile = '';

    //an alert is created when an event is pushed to Google Calendar
    $scope.alerts = [];
    $scope.googleCalCheckBox = false;
    $scope.ifValue = true;

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };

    $scope.addAlert = function(alert) {
      $scope.alerts.push(alert);
    };

    $scope.showIf = function() {
      return $scope.ifValue;
    };

    $scope.hideIf = function() {
      return !$scope.ifValue;
    };
    
    $scope.googleCalBox = function() {
      return !$scope.googleCalCheckBox;
    };

    $scope.refreshEvents = function() {

      eventModel.getData().then(function(events) {
        var allEvents = events.data;
        var today = moment().dayOfYear();

        for (var i = 0; i < allEvents.length; i++) {
          var eachDib = moment(allEvents[i].eventDate).dayOfYear();
          var diff = eachDib - today;
          allEvents[i].diff = diff;
        }
        var formattedEvents = eventModel.formatData(events);
        $scope.bookedEvents = formattedEvents;
      });
    };

    $scope.renderSideDashboard = function() {

      $state.go('dashboardPage.events');
      eventModel.getData().then(function successCallback(events) {
        var allEvents = events.data;
        var today = moment().dayOfYear();

        for (var i = 0; i < allEvents.length; i++) {
          var eachDib = moment(allEvents[i].eventDate).dayOfYear();
          var diff = eachDib - today;
          allEvents[i].diff = diff;
        }
        var formattedEvents = eventModel.formatData(events);
        $scope.bookedEvents = formattedEvents;

      }, function errorCallback(response) {
        
        //redirect to signup
        $state.go('signupPage');
      });
    };

    $scope.highlightEvents = function(event) {
      //console.log('test', event.diff);

      if (event.diff <= 1) {
        //console.log(true);
        return true;
      } else {
        //console.log(false);
        return false;
      }
    };

    $scope.eventSubmit = function() {
      var $events = $scope.eve;
      eventModel.eventData($events)
        .then(function(message) {
          if (!message.data.result) {
            alert('Someone else called Dibs!');
          }
        });

      if($scope.googleCalCheckBox) {
        $scope.addToGoogleCal();
      }

      $scope.refreshEvents();
      $scope.renderSideDashboard();
      $scope.refreshAllEvents();
      $scope.renderSideDashboardChart();

    };

    $scope.addToGoogleCal = function() {
      googleCalModel.postToGoogleCal($scope.eve)
                    .then(function(response) {
                      var successMessage = "Successfully added to Google Calendar! View the event ";
                      $scope.addAlert({
                        type: 'success',
                        msg: successMessage,
                        url: response.data
                      });                      
                    });
    }

    $scope.signout = function() {
      //remove jwt here
      //and remove passport session
      $http({
        method: 'GET',
        url: '/logout'
      }).then(function successCallback(response) {
        // this callback will be called asynchronously
        console.log("I'm signing out");
        $window.localStorage.clear();
        $state.go('signupPage');
        // when the response is available
      }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });

    };

    $scope.getUserInfo = function() {
      $http({
        method: 'GET',
        url: '/api/events/user'
      }).then(function successCallback(response) {
        $scope.eve.user = response.data.profile._json.displayName;

        var profile = {
          user_name: response.data.profile._json.displayName,
          profile_picture: response.data.profile.photos[0].value
        };

        $scope.user_profile = profile;
      });
    };

    $scope.getUserInfo();

    //TIME ADDON
    $scope.eve.eventDate = new Date();
    $scope.hstep = 1;
    $scope.mstep = 1;
    $scope.options = {
      hstep: [1, 2, 3],
      mstep: [1, 5, 10, 15, 25, 30]
    };

    $scope.eve.eventEndDate = new Date();
    $scope.hstep = 1;
    $scope.mstep = 1;
    $scope.options = {
      hstep: [1, 2, 3],
      mstep: [1, 5, 10, 15, 25, 30]
    };

    $scope.ismeridian = true;
    $scope.toggleMode = function() {
      $scope.ismeridian = !$scope.ismeridian;
    };

    $scope.update = function() {
      var d = $scope.eve.eventDate;
      d.setHours(15);
      d.setMinutes(0);
      // $scope.eve.eventDate = d;
    };

    // used to help render the date
    $scope.dt = +new Date();

    $scope.today = function() {
      $scope.eve.eventDate = new Date();
    };

    $scope.today();

    $scope.clear = function() {
      $scope.eve.eventDate = null;
    };

    $scope.toggleMin = function() {
      $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();
    $scope.maxDate = new Date(2020, 5, 22);

    $scope.open = function($event) {
      $scope.status.opened = true;
    };

    $scope.openEnd = function($event) {
      $scope.status.opened2 = true;
    };

    $scope.setDate = function(year, month, day) {
      $scope.eve.eventDate = new Date(year, month, day);
    };

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];

    $scope.status = {
      opened: false
    };

    $scope.status2 = {
      opened2: false
    };

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var afterTomorrow = new Date();
    afterTomorrow.setDate(tomorrow.getDate() + 2);
    $scope.events = [{
      date: tomorrow,
      status: 'full'
    }, {
      date: afterTomorrow,
      status: 'partially'
    }];

    $scope.getDayClass = function(date, mode) {
      if (mode === 'day') {
        var dayToCheck = new Date(date).setHours(0, 0, 0, 0);
        for (var i = 0; i < $scope.events.length; i++) {
          var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);
          if (dayToCheck === currentDay) {
            return $scope.events[i].status;
          }
        }
      }
      return '';
    };

    $scope.getEventDataButton = function() {
      eventModel.getAllData().then(function(events) {
        var formattedEvents = eventModel.formatAllData(events);
        console.log(formattedEvents);
        GLOBALVAR = formattedEvents;
      });
    };

    $scope.refreshAllEvents = function() {
      eventModel.getAllData().then(function(events) {


        var allEvents = events.data;
        //console.log(allEvents);
        var today = moment().dayOfYear();

        for (var i = 0; i < allEvents.length; i++) {
          var eachDib = moment(allEvents[i].eventDate).dayOfYear();
          var diff = eachDib - today;
          allEvents[i].diff = diff;
          //console.log('This is the flag', diff);
        }
        var formattedEvents = eventModel.formatAllData(events);
        $scope.bookedEvents = formattedEvents;
      });
    };

    $scope.renderSideDashboardChart = function() {

      eventModel.getAllData().then(function successCallback(events) {
        var allEvents = events.data;
        //console.log(allEvents);
        var today = moment().dayOfYear();

        for (var i = 0; i < allEvents.length; i++) {
          var eachDib = moment(allEvents[i].eventDate).dayOfYear();
          var diff = eachDib - today;
          allEvents[i].diff = diff;
          //console.log('This is the flag', diff);
        }
        var formattedEvents = eventModel.formatAllData(events);
        // $scope.bookedEvents = formattedEvents;
      }, function errorCallback(response) {

        //do not have access to events resource
        //user must not be logged in
        //redirect to signup

        $state.go('signupPage');

        console.log("RESPONSE", response);

      });

      // removing past daily dibs every 30s
      //$scope.refreshEvents();
    };

    $scope.renderSideDashboardChart2 = function() {
      $state.go('dashboardPage.eventsChart');
    };

    $scope.getEventDataButton();
  });