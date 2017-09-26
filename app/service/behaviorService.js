let Behavior = require('../models/behavior');
let User = require('../models/user');
let moment = require('moment');
let async = require('async');

function getUserQuestionsBehaviors(user, res, callback) {
    let questionTags = ['star_question', 'upvote_question', 'downvote_question', 'open_question', 'open_hot_network_question', 'open_page'];
    let userQuestionQueryResults = {
        starQuestionsCount: 0,
        upvoteQuestionsCount: 0,
        downvoteQuestionsCount: 0,
        questionInterestCount: 0
    };

    Behavior.find({ 'userId': user._id, 'type': { $in: questionTags } }, function(err, userQuestionsBehaviors) {
        if (err)
            throw err;
        else {
            for (let i = userQuestionsBehaviors.length - 1; i >= 0; i--) {
                if (userQuestionsBehaviors[i].type == questionTags[0]) {
                    userQuestionQueryResults.starQuestionsCount++;
                } else if (userQuestionsBehaviors[i].type == questionTags[1]) {
                    userQuestionQueryResults.upvoteQuestionsCount++;
                } else if (userQuestionsBehaviors[i].type == questionTags[2]) {
                    userQuestionQueryResults.downvoteQuestionsCount++;
                } else if (userQuestionsBehaviors[i].type == questionTags[3] || userQuestionsBehaviors[i].type == questionTags[4]) {
                    userQuestionQueryResults.questionInterestCount++;
                }
            }
            callback(null, user, res, userQuestionQueryResults);
        }
    });
}

function getOtherUsersQuestionsBehaviors(user, res, userQuestionQueryResults, callback) {
    let questionTags = ['star_question', 'upvote_question', 'downvote_question', 'open_question', 'open_hot_network_question', 'open_page'];
    let otherUsersQuestionQueryResults = {
        starQuestionsCount: 0,
        upvoteQuestionsCount: 0,
        downvoteQuestionsCount: 0,
        count: 0,
        questionInterestCount: 0
    };

    Behavior.find({ 'userId': { $ne: user._id }, 'type': { $in: questionTags } }, function(err, othersQuestionsBehaviors) {
        if (err)
            throw err;
        else {
            for (let i = othersQuestionsBehaviors.length - 1; i >= 0; i--) {
                if (othersQuestionsBehaviors[i].type == questionTags[0]) {
                    otherUsersQuestionQueryResults.starQuestionsCount++;
                } else if (othersQuestionsBehaviors[i].type == questionTags[1]) {
                    otherUsersQuestionQueryResults.upvoteQuestionsCount++;
                } else if (othersQuestionsBehaviors[i].type == questionTags[2]) {
                    otherUsersQuestionQueryResults.downvoteQuestionsCount++;
                } else if (othersQuestionsBehaviors[i].type == questionTags[3] || othersQuestionsBehaviors[i].type == questionTags[4]) {
                    otherUsersQuestionQueryResults.questionInterestCount++;
                }
                otherUsersQuestionQueryResults.count++;
            }
            callback(null, user, res, userQuestionQueryResults, otherUsersQuestionQueryResults);
        }
    });
}

function getUserAnswerBehaviors(user, res, userQuestionQueryResults, otherUsersQuestionQueryResults, callback) {
    let answerTags = ['copy_answer', 'upvote_answer', 'downvote_answer'];
    let userAnswersQueryResults = {
        copyAnswersCount: 0,
        upvoteAnswersCount: 0,
        downvoteAnswersCount: 0
    };

    Behavior.find({ 'userId': user._id, 'type': { $in: answerTags } }, function(err, userAnswersBehaviors) {
        if (err)
            throw err;
        else {
            for (let i = userAnswersBehaviors.length - 1; i >= 0; i--) {
                if (userAnswersBehaviors[i].type == answerTags[0]) {
                    userAnswersQueryResults.copyAnswersCount++;
                } else if (userAnswersBehaviors[i].type == answerTags[1]) {
                    userAnswersQueryResults.upvoteAnswersCount++;
                } else if (userAnswersBehaviors[i].type == answerTags[2]) {
                    userAnswersQueryResults.downvoteAnswersCount++;
                }
            }
            callback(null, user, res, userQuestionQueryResults, otherUsersQuestionQueryResults, userAnswersQueryResults);
        }
    });
}

function getOthersAnswerBehaviors(user, res, userQuestionQueryResults, otherUsersQuestionQueryResults, userAnswersQueryResults, callback) {
    let answerTags = ['copy_answer', 'upvote_answer', 'downvote_answer'];
    let othersAnswersQueryResults = {
        copyAnswersCount: 0,
        upvoteAnswersCount: 0,
        downvoteAnswersCount: 0,
        count: 0
    };

    Behavior.find({ 'userId': { $ne: user._id }, 'type': { $in: answerTags } }, function(err, othersAnswersBehaviors) {
        if (err)
            throw err;
        else {
            for (let i = othersAnswersBehaviors.length - 1; i >= 0; i--) {
                if (othersAnswersBehaviors[i].type == answerTags[0]) {
                    othersAnswersQueryResults.copyAnswersCount++;
                } else if (othersAnswersBehaviors[i].type == answerTags[1]) {
                    othersAnswersQueryResults.upvoteAnswersCount++;
                } else if (othersAnswersBehaviors[i].type == answerTags[2]) {
                    othersAnswersQueryResults.downvoteAnswersCount++;
                }
                othersAnswersQueryResults.count++;
            }
            callback(null, user, res, userQuestionQueryResults, otherUsersQuestionQueryResults, userAnswersQueryResults, othersAnswersQueryResults);
        }
    });
}

function getUserContributions(user, res, userQuestionQueryResults, otherUsersQuestionQueryResults, userAnswersQueryResults, othersAnswersQueryResults, callback) {
    let contributionTags = ['add_answer', 'add_comment'];
    let userContributionsQueryResults = {
        addAnswerCount: 0,
        addCommentCount: 0
    };

    Behavior.find({ 'userId': user._id, 'type': { $in: contributionTags } }, function(err, userContributionBehaviors) {
        if (err)
            throw err;
        else {
            for (let i = userContributionBehaviors.length - 1; i >= 0; i--) {
                if (userContributionBehaviors[i].type == contributionTags[0]) {
                    userContributionsQueryResults.addAnswerCount++;
                } else if (userContributionBehaviors[i].type == contributionTags[1]) {
                    userContributionsQueryResults.addCommentCount++;
                }
            }
            callback(null, user, res, userQuestionQueryResults, otherUsersQuestionQueryResults, userAnswersQueryResults, othersAnswersQueryResults, userContributionsQueryResults);
        }
    });
}

function getOthersContributions(user, res, userQuestionQueryResults, otherUsersQuestionQueryResults, userAnswersQueryResults, othersAnswersQueryResults, userContributionsQueryResults, callback) {
    let contributionTags = ['add_answer', 'add_comment'];
    let othersContributionsQueryResults = {
        addAnswerCount: 0,
        addCommentCount: 0,
        count: 0
    };

    Behavior.find({ 'userId': { $ne: user._id }, 'type': { $in: contributionTags } }, function(err, othersContributionBehaviors) {
        if (err)
            throw err;
        else {
            for (let i = othersContributionBehaviors.length - 1; i >= 0; i--) {
                if (othersContributionBehaviors[i].type == contributionTags[0]) {
                    othersContributionsQueryResults.addAnswerCount++;
                } else if (othersContributionBehaviors[i].type == contributionTags[1]) {
                    othersContributionsQueryResults.addCommentCount++;
                }
                othersContributionsQueryResults.count++;
            }
            callback(null, user, res, userQuestionQueryResults, otherUsersQuestionQueryResults, userAnswersQueryResults, othersAnswersQueryResults, userContributionsQueryResults, othersContributionsQueryResults);
        }
    });
}

function getUserUsage(user, res, userQuestionQueryResults, otherUsersQuestionQueryResults, userAnswersQueryResults, othersAnswersQueryResults, userContributionsQueryResults, othersContributionsQueryResults, callback) {
    let userUsageQueryResults = {
        earlyMorning: 0,
        morning: 0,
        noon: 0,
        evening: 0,
        night: 0
    };

    Behavior.find({ 'userId': user._id, }, function(err, userUsageBehaviors) {
        if (err)
            throw err;
        else {
            for (let i = userUsageBehaviors.length - 1; i >= 0; i--) {
                if (moment(userUsageBehaviors[i].dateTime, 'HH:mm').isAfter(moment(moment(userUsageBehaviors[i].dateTime).format('YYYY-MM-DD').valueOf() + ' ' + '00:00')) && moment(userUsageBehaviors[i].dateTime, 'HH:mm').isBefore(moment(moment(userUsageBehaviors[i].dateTime).format('YYYY-MM-DD').valueOf() + ' ' + '05:59'))) {
                    userUsageQueryResults.earlyMorning++;
                } else if (moment(userUsageBehaviors[i].dateTime, 'HH:mm').isAfter(moment(moment(userUsageBehaviors[i].dateTime).format('YYYY-MM-DD').valueOf() + ' ' + '06:00')) && moment(userUsageBehaviors[i].dateTime, 'HH:mm').isBefore(moment(moment(userUsageBehaviors[i].dateTime).format('YYYY-MM-DD').valueOf() + ' ' + '10:59'))) {
                    userUsageQueryResults.morning++;
                } else if (moment(userUsageBehaviors[i].dateTime, 'HH:mm').isAfter(moment(moment(userUsageBehaviors[i].dateTime).format('YYYY-MM-DD').valueOf() + ' ' + '11:00')) && moment(userUsageBehaviors[i].dateTime, 'HH:mm').isBefore(moment(moment(userUsageBehaviors[i].dateTime).format('YYYY-MM-DD').valueOf() + ' ' + '15:59'))) {
                    userUsageQueryResults.noon++;
                } else if (moment(userUsageBehaviors[i].dateTime, 'HH:mm').isAfter(moment(moment(userUsageBehaviors[i].dateTime).format('YYYY-MM-DD').valueOf() + ' ' + '16:00')) && moment(userUsageBehaviors[i].dateTime, 'HH:mm').isBefore(moment(moment(userUsageBehaviors[i].dateTime).format('YYYY-MM-DD').valueOf() + ' ' + '19:59'))) {
                    userUsageQueryResults.evening++;
                } else if (moment(userUsageBehaviors[i].dateTime, 'HH:mm').isAfter(moment(moment(userUsageBehaviors[i].dateTime).format('YYYY-MM-DD').valueOf() + ' ' + '20:00')) && moment(userUsageBehaviors[i].dateTime, 'HH:mm').isBefore(moment(moment(userUsageBehaviors[i].dateTime).format('YYYY-MM-DD').valueOf() + ' ' + '23:59'))) {
                    userUsageQueryResults.night++;
                }
            }

            callback(null, user, res, userQuestionQueryResults, otherUsersQuestionQueryResults, userAnswersQueryResults, othersAnswersQueryResults, userContributionsQueryResults, othersContributionsQueryResults, userUsageQueryResults);
        }
    });
}

function getOthersUsage(user, res, userQuestionQueryResults, otherUsersQuestionQueryResults, userAnswersQueryResults, othersAnswersQueryResults, userContributionsQueryResults, othersContributionsQueryResults, userUsageQueryResults, callback) {
    let othersUsageQueryResults = {
        earlyMorning: 0,
        morning: 0,
        noon: 0,
        evening: 0,
        night: 0,
        count: 0
    };

    Behavior.find({ 'userId': { $ne: user._id } }, function(err, othersUsageBehaviors) {
        if (err)
            throw err;
        else {
            for (let i = othersUsageBehaviors.length - 1; i >= 0; i--) {
                if (moment(othersUsageBehaviors[i].dateTime, 'HH:mm').isAfter(moment(moment(othersUsageBehaviors[i].dateTime).format('YYYY-MM-DD').valueOf() + ' ' + '00:00')) && moment(othersUsageBehaviors[i].dateTime, 'HH:mm').isBefore(moment(moment(othersUsageBehaviors[i].dateTime).format('YYYY-MM-DD').valueOf() + ' ' + '05:59'))) {
                    othersUsageQueryResults.earlyMorning++;
                } else if (moment(othersUsageBehaviors[i].dateTime, 'HH:mm').isAfter(moment(moment(othersUsageBehaviors[i].dateTime).format('YYYY-MM-DD').valueOf() + ' ' + '06:00')) && moment(othersUsageBehaviors[i].dateTime, 'HH:mm').isBefore(moment(moment(othersUsageBehaviors[i].dateTime).format('YYYY-MM-DD').valueOf() + ' ' + '10:59'))) {
                    othersUsageQueryResults.morning++;
                } else if (moment(othersUsageBehaviors[i].dateTime, 'HH:mm').isAfter(moment(moment(othersUsageBehaviors[i].dateTime).format('YYYY-MM-DD').valueOf() + ' ' + '11:00')) && moment(othersUsageBehaviors[i].dateTime, 'HH:mm').isBefore(moment(moment(othersUsageBehaviors[i].dateTime).format('YYYY-MM-DD').valueOf() + ' ' + '15:59'))) {
                    othersUsageQueryResults.noon++;
                } else if (moment(othersUsageBehaviors[i].dateTime, 'HH:mm').isAfter(moment(moment(othersUsageBehaviors[i].dateTime).format('YYYY-MM-DD').valueOf() + ' ' + '16:00')) && moment(othersUsageBehaviors[i].dateTime, 'HH:mm').isBefore(moment(moment(othersUsageBehaviors[i].dateTime).format('YYYY-MM-DD').valueOf() + ' ' + '19:59'))) {
                    othersUsageQueryResults.evening++;
                } else if (moment(othersUsageBehaviors[i].dateTime, 'HH:mm').isAfter(moment(moment(othersUsageBehaviors[i].dateTime).format('YYYY-MM-DD').valueOf() + ' ' + '20:00')) && moment(othersUsageBehaviors[i].dateTime, 'HH:mm').isBefore(moment(moment(othersUsageBehaviors[i].dateTime).format('YYYY-MM-DD').valueOf() + ' ' + '23:59'))) {
                    othersUsageQueryResults.night++;
                }
                othersUsageQueryResults.count++;
            }

            callback(null, user, res, userQuestionQueryResults, otherUsersQuestionQueryResults, userAnswersQueryResults, othersAnswersQueryResults, userContributionsQueryResults, othersContributionsQueryResults, userUsageQueryResults, othersUsageQueryResults);
        }
    });
}

function getStats(user, res) {

    async.waterfall([
        async.apply(getUserQuestionsBehaviors, user, res),
        getOtherUsersQuestionsBehaviors,
        getUserAnswerBehaviors,
        getOthersAnswerBehaviors,
        getUserContributions,
        getOthersContributions,
        getUserUsage,
        getOthersUsage
    ], function(err, user, res, userQuestionQueryResults, otherUsersQuestionQueryResults, userAnswersQueryResults, othersAnswersQueryResults, userContributionsQueryResults, othersContributionsQueryResults, userUsageQueryResults, othersUsageQueryResults) {
        if (err) {
            throw err;
        } else {
            let graphOneResult = formGraphValues1(userQuestionQueryResults, otherUsersQuestionQueryResults, userAnswersQueryResults, othersAnswersQueryResults);
            let graphTwoResult = formGraphValues2(userContributionsQueryResults, othersContributionsQueryResults);
            let graphThreeResult = formGraphValues3(userUsageQueryResults, othersUsageQueryResults);

            res.render('stats.ejs', {
                username: user.local.username,
                behaviors: userQuestionQueryResults,
                graphOneResult: graphOneResult,
                graphTwoResult: graphTwoResult,
                graphThreeResult: graphThreeResult,
                moment: moment
            });
        }
    });
}

function formGraphValues1(userQuestionQueryResults, otherUsersQuestionQueryResults, userAnswersQueryResults, othersAnswersQueryResults) {
    let graphOneResult = {
        questionsGraphResult: {
            userResults: [],
            othersResults: []
        },
        answersGraphResult: {
            userResults: [],
            othersResults: []
        }
    };

    graphOneResult.questionsGraphResult.userResults[0] = Math.round(userQuestionQueryResults.upvoteQuestionsCount * 1.5);
    graphOneResult.questionsGraphResult.userResults[1] = Math.round(userQuestionQueryResults.downvoteQuestionsCount * 1.5);
    graphOneResult.questionsGraphResult.userResults[2] = Math.round(userQuestionQueryResults.starQuestionsCount * 1.25);
    graphOneResult.questionsGraphResult.userResults[3] = Math.round(userQuestionQueryResults.questionInterestCount * 1.75);
    graphOneResult.questionsGraphResult.othersResults[0] = Math.round(otherUsersQuestionQueryResults.upvoteQuestionsCount * 1.5);
    graphOneResult.questionsGraphResult.othersResults[1] = Math.round(otherUsersQuestionQueryResults.downvoteQuestionsCount * 1.5);
    graphOneResult.questionsGraphResult.othersResults[2] = Math.round(otherUsersQuestionQueryResults.starQuestionsCount * 1.25);
    graphOneResult.questionsGraphResult.othersResults[3] = Math.round(otherUsersQuestionQueryResults.questionInterestCount * 1.75);
    graphOneResult.answersGraphResult.userResults[0] = Math.round(userAnswersQueryResults.upvoteAnswersCount * 1.5);
    graphOneResult.answersGraphResult.userResults[1] = Math.round(userAnswersQueryResults.downvoteAnswersCount * 1.5);
    graphOneResult.answersGraphResult.userResults[2] = Math.round(userAnswersQueryResults.copyAnswersCount * 1.25);
    graphOneResult.answersGraphResult.othersResults[0] = Math.round(othersAnswersQueryResults.upvoteAnswersCount * 1.5);
    graphOneResult.answersGraphResult.othersResults[1] = Math.round(othersAnswersQueryResults.downvoteAnswersCount * 1.5);
    graphOneResult.answersGraphResult.othersResults[2] = Math.round(othersAnswersQueryResults.copyAnswersCount * 1.25);

    return graphOneResult;
}

function formGraphValues2(userContributionsQueryResults, othersContributionsQueryResults) {
    let graphTwoResult = {
        userResults: [],
        othersResults: []
    };

    graphTwoResult.userResults[0] = Math.round(userContributionsQueryResults.addAnswerCount * 2.5);
    graphTwoResult.userResults[1] = Math.round(userContributionsQueryResults.addCommentCount * 1.5);
    graphTwoResult.othersResults[0] = Math.round(othersContributionsQueryResults.addAnswerCount * 2.5);
    graphTwoResult.othersResults[1] = Math.round(othersContributionsQueryResults.addCommentCount * 1.5);

    return graphTwoResult;
}

function formGraphValues3(userUsageQueryResults, othersUsageQueryResults) {
    let graphThreeResult = {
        userResults: [10, 20, 30, 40, 50],
        othersResults: [20, 50, 10, 30, 40]
    };

    graphThreeResult.userResults[0] = Math.round(userUsageQueryResults.earlyMorning * 1.5);
    graphThreeResult.userResults[1] = Math.round(userUsageQueryResults.morning * 1.5);
    graphThreeResult.userResults[2] = Math.round(userUsageQueryResults.noon * 1.5);
    graphThreeResult.userResults[3] = Math.round(userUsageQueryResults.evening * 1.5);
    graphThreeResult.userResults[4] = Math.round(userUsageQueryResults.night * 1.5);

    graphThreeResult.othersResults[0] = Math.round(othersUsageQueryResults.earlyMorning * 1.5);
    graphThreeResult.othersResults[1] = Math.round(othersUsageQueryResults.morning * 1.5);
    graphThreeResult.othersResults[2] = Math.round(othersUsageQueryResults.noon * 1.5);
    graphThreeResult.othersResults[3] = Math.round(othersUsageQueryResults.evening * 1.5);
    graphThreeResult.othersResults[4] = Math.round(othersUsageQueryResults.night * 1.5);

    return graphThreeResult;
}

module.exports = {
    addLog: function(username, type, dateTime, data, link) {
        User.findOne({ 'local.username': decodeURIComponent(username) }, function(err, user) {
            let newBehavior = new Behavior();

            newBehavior.userId = user._id;
            newBehavior.type = type;
            newBehavior.dateTime = dateTime;
            newBehavior.data = data;
            newBehavior.link = link;
            newBehavior.save(function(err) {
                if (err)
                    throw err;
                return;
            });
        });
    },
    getLogs: function(user, res) {
        Behavior.find({ 'userId': user._id }, function(err, behaviors) {
            if (err)
                throw err;
            else {
                res.render('behaviors.ejs', {
                    username: user.local.username,
                    behaviors: behaviors,
                    moment: moment
                });
            }
        });
    },
    getStats: getStats
}
