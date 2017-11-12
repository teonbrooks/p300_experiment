// Helper function
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

const trial_duration = 300;
const stim_duration = 200;
const iti = 300;
const jitter = 200;
const n_trials = 2010;
const prob = .15

var post_trial_gap = function() {
  return Math.floor( Math.random() * jitter ) + iti;
}

// Stimuli
var base_path = 'assets/images/';
var targets = ['target-76116_640.jpg', 'target-360807_640.jpg', 'target-468232_640.jpg', 'target-2083492_640.jpg'];
var nontargets = ['nontarget-234836_640.jpg', 'nontarget-274183_640.jpg', 'nontarget-280332_640.jpg', 'nontarget-734689_640.jpg'];

targets = targets.map(target => (base_path + target));
nontargets = nontargets.map(nontarget => (base_path + nontarget));

var stimuli_order = [];

for (counter = 0; counter < n_trials; counter++){
    stimuli_order.push(Math.random() > prob)
};

var stim_list = []
for (counter = 0; counter < n_trials; counter++){
  if (stimuli_order[counter] == true) {
    let photo_idx = getRandomInt(0, targets.length);
    var trial = {
      stimulus: targets[photo_idx],
      on_start: function(){
        console.log('target')
      },
      on_finish: function(data){
        data.correct = data.key_press === jsPsych.pluginAPI.convertKeyCharacterToKeyCode('j');
        // console.log(data.correct);
      }
    };
  } else {
    let photo_idx = getRandomInt(0, nontargets.length);
    var trial = {
      stimulus: nontargets[photo_idx],
      on_start: function(){
        console.log('nontarget')
      },
      on_finish: function(data){
        data.correct = data.key_press == jsPsych.pluginAPI.convertKeyCharacterToKeyCode('f');
        // console.log(data.correct);
      }
    };
  };
  stim_list.push(trial);
};


/* create timeline */
var timeline = [];
/* define welcome message trial */
var welcome_block = {
  type: "html-keyboard-response",
  stimulus: "Welcome to the experiment. Press any key to begin."
};
timeline.push(welcome_block);
/* define instructions trial */
var instructions = {
  type: "html-keyboard-response",
  stimulus: "<p>In this experiment, a pet will appear in the center " +
      "of the screen.</p><p>If the pet is <strong>dog</strong>, " +
      "press the letter F on the keyboard as fast as you can.</p>" +
      "<p>If the circle is <strong>cat</strong>, press the letter J " +
      "as fast as you can.</p>" +
      "<div style='float: left;'><img src='assets/images/nontarget-234836_640.jpg'></img>" +
      "<p class='small'><strong>Press the F key</strong></p></div>" +
      "<div class='float: right;'><img src='assets/images/target-76116_640.jpg'></img>" +
      "<p class='small'><strong>Press the J key</strong></p></div>" +
      "<p>Press any key to begin.</p>",
  post_trial_gap: 2000
};
timeline.push(instructions);


var test_trials = {
  stimulus: jsPsych.timelineVariable('stimulus'),
  type: 'custom-image-keyboard-response',
  timeline: stim_list,
  choices: ['f', 'j'],
  trial_duration: trial_duration,
  stimulus_duration: stim_duration,
  post_trial_gap: post_trial_gap()
  // on_finish: function(data){
  //   data.correct = data.key_press == trial.correct_response
  // }
};

// timeline.push(test_trials);
timeline = timeline.concat(test_trials);
/* define debrief */
var debrief_block = {
  type: "html-keyboard-response",
  stimulus: function() {
    var trials = jsPsych.data.get().filter({test_part: 'test'});
    var correct_trials = trials.filter({correct: true});
    var accuracy = Math.round(correct_trials.count() / trials.count() * 100);
    var rt = Math.round(correct_trials.select('rt').mean());
    return "<p>You responded correctly on "+accuracy+"% of the trials.</p>"+
    "<p>Your average response time was "+rt+"ms.</p>"+
    "<p>Press any key to complete the experiment. Thank you!</p>";
  }
};
timeline.push(debrief_block);
/* start the experiment */
jsPsych.init({
  timeline: timeline,
  default_iti: 3000,
  on_finish: function() {
    jsPsych.data.displayData();
    // jsPsych.data.getData('p300_results.csv', 'csv');
  }
});
