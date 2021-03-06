import request from 'request';
import {config} from '../../src/config';
import {db, privateDB} from '../../src/databases/databases';
import {Done, getbaseURL} from '../utils';
import {getHash} from '../../src/utils/getHash';
import {ImportMock} from 'ts-mock-imports';
import * as YouTubeAPIModule from '../../src/utils/youtubeApi';
import {YouTubeApiMock} from '../youtubeMock';

const mockManager = ImportMock.mockStaticClass(YouTubeAPIModule, 'YouTubeAPI');
const sinonStub = mockManager.mock('listVideos');
sinonStub.callsFake(YouTubeApiMock.listVideos);

describe('voteOnSponsorTime', () => {
    before(() => {
        const now = Date.now();
        const warnVip01Hash = getHash("warn-vip01");
        const warnUser01Hash = getHash("warn-voteuser01");
        const warnUser02Hash = getHash("warn-voteuser02");
        const MILLISECONDS_IN_HOUR = 3600000;
        const warningExpireTime = MILLISECONDS_IN_HOUR * config.hoursAfterWarningExpires;
        let startOfQuery = "INSERT INTO sponsorTimes (videoID, startTime, endTime, votes, UUID, userID, timeSubmitted, views, category, shadowHidden, hashedVideoID) VALUES";
        const startOfWarningQuery = 'INSERT INTO warnings (userID, issueTime, issuerUserID) VALUES';

        db.exec(startOfQuery + "('vote-testtesttest', 1, 11, 2, 'vote-uuid-0', 'testman', 0, 50, 'sponsor', 0, '" + getHash('vote-testtesttest', 1) + "')");
        db.exec(startOfQuery + "('vote-testtesttest2', 1, 11, 2, 'vote-uuid-1', 'testman', 0, 50, 'sponsor', 0, '" + getHash('vote-testtesttest2', 1) + "')");
        db.exec(startOfQuery + "('vote-testtesttest2', 1, 11, 10, 'vote-uuid-1.5', 'testman', 0, 50, 'outro', 0, '" + getHash('vote-testtesttest2', 1) + "')");
        db.exec(startOfQuery + "('vote-testtesttest2', 1, 11, 10, 'vote-uuid-1.6', 'testman', 0, 50, 'interaction', 0, '" + getHash('vote-testtesttest2', 1) + "')");
        db.exec(startOfQuery + "('vote-testtesttest3', 20, 33, 10, 'vote-uuid-2', 'testman', 0, 50, 'intro', 0, '" + getHash('vote-testtesttest3', 1) + "')");
        db.exec(startOfQuery + "('vote-testtesttest,test', 1, 11, 100, 'vote-uuid-3', 'testman', 0, 50, 'sponsor', 0, '" + getHash('vote-testtesttest,test', 1) + "')");
        db.exec(startOfQuery + "('vote-test3', 1, 11, 2, 'vote-uuid-4', 'testman', 0, 50, 'sponsor', 0, '" + getHash('vote-test3', 1) + "')");
        db.exec(startOfQuery + "('vote-test3', 7, 22, -3, 'vote-uuid-5', 'testman', 0, 50, 'intro', 0, '" + getHash('vote-test3', 1) + "')");
        db.exec(startOfQuery + "('vote-test3', 7, 22, -3, 'vote-uuid-5_1', 'testman', 0, 50, 'intro', 0, '" + getHash('vote-test3', 1) + "')");
        db.exec(startOfQuery + "('vote-multiple', 1, 11, 2, 'vote-uuid-6', 'testman', 0, 50, 'intro', 0, '" + getHash('vote-multiple', 1) + "')");
        db.exec(startOfQuery + "('vote-multiple', 20, 33, 2, 'vote-uuid-7', 'testman', 0, 50, 'intro', 0, '" + getHash('vote-multiple', 1) + "')");
        db.exec(startOfQuery + "('voter-submitter', 1, 11, 2, 'vote-uuid-8', '" + getHash("randomID") + "', 0, 50, 'sponsor', 0, '" + getHash('voter-submitter', 1) + "')");
        db.exec(startOfQuery + "('voter-submitter2', 1, 11, 2, 'vote-uuid-9', '" + getHash("randomID2") + "', 0, 50, 'sponsor', 0, '" + getHash('voter-submitter2', 1) + "')");
        db.exec(startOfQuery + "('voter-submitter2', 1, 11, 2, 'vote-uuid-10', '" + getHash("randomID3") + "', 0, 50, 'sponsor', 0, '" + getHash('voter-submitter2', 1) + "')");
        db.exec(startOfQuery + "('voter-submitter2', 1, 11, 2, 'vote-uuid-11', '" + getHash("randomID4") + "', 0, 50, 'sponsor', 0, '" + getHash('voter-submitter2', 1) + "')");
        db.exec(startOfQuery + "('own-submission-video', 1, 11, 500, 'own-submission-uuid', '" + getHash('own-submission-id') + "', 0, 50, 'sponsor', 0, '" + getHash('own-submission-video', 1) + "')");
        db.exec(startOfQuery + "('not-own-submission-video', 1, 11, 500, 'not-own-submission-uuid', '" + getHash('somebody-else-id') + "', 0, 50, 'sponsor', 0, '" + getHash('not-own-submission-video', 1) + "')");
        db.exec(startOfQuery + "('incorrect-category', 1, 11, 500, 'incorrect-category', '" + getHash('somebody-else-id') + "', 0, 50, 'sponsor', 0, '" + getHash('incorrect-category', 1) + "')");
        db.exec(startOfQuery + "('incorrect-category-change', 1, 11, 500, 'incorrect-category-change', '" + getHash('somebody-else-id') + "', 0, 50, 'sponsor', 0, '" + getHash('incorrect-category-change', 1) + "')");
        db.exec(startOfQuery + "('vote-testtesttest', 1, 11, 2, 'warnvote-uuid-0', 'testman', 0, 50, 'sponsor', 0, '" + getHash('vote-testtesttest', 1) + "')");
        db.exec(startOfQuery + "('no-sponsor-segments-video', 1, 11, 2, 'no-sponsor-segments-uuid-0', 'no-sponsor-segments', 0, 50, 'sponsor', 0, '" + getHash('no-sponsor-segments-video', 1) + "')");
        db.exec(startOfQuery + "('no-sponsor-segments-video', 1, 11, 2, 'no-sponsor-segments-uuid-1', 'no-sponsor-segments', 0, 50, 'intro', 0, '" + getHash('no-sponsor-segments-video', 1) + "')");

        db.exec(startOfWarningQuery + "('" + warnUser01Hash + "', '" + now + "', '" + warnVip01Hash + "')");
        db.exec(startOfWarningQuery + "('" + warnUser01Hash + "', '" + (now - 1000) + "', '" + warnVip01Hash + "')");
        db.exec(startOfWarningQuery + "('" + warnUser01Hash + "', '" + (now - 2000) + "', '" + warnVip01Hash + "')");
        db.exec(startOfWarningQuery + "('" + warnUser01Hash + "', '" + (now - 3601000) + "', '" + warnVip01Hash + "')");
        db.exec(startOfWarningQuery + "('" + warnUser02Hash + "', '" + now + "', '" + warnVip01Hash + "')");
        db.exec(startOfWarningQuery + "('" + warnUser02Hash + "', '" + now + "', '" + warnVip01Hash + "')");
        db.exec(startOfWarningQuery + "('" + warnUser02Hash + "', '" + (now - (warningExpireTime + 1000)) + "', '" + warnVip01Hash + "')");
        db.exec(startOfWarningQuery + "('" + warnUser02Hash + "', '" + (now - (warningExpireTime + 2000)) + "', '" + warnVip01Hash + "')");


        db.exec("INSERT INTO vipUsers (userID) VALUES ('" + getHash("VIPUser") + "')");
        privateDB.exec("INSERT INTO shadowBannedUsers (userID) VALUES ('" + getHash("randomID4") + "')");

        db.exec("INSERT INTO noSegments (videoID, userID, category) VALUES ('no-sponsor-segments-video', 'someUser', 'sponsor')");

    });

    it('Should be able to upvote a segment', (done: Done) => {
        request.get(getbaseURL()
            + "/api/voteOnSponsorTime?userID=randomID&UUID=vote-uuid-0&type=1", null,
            (err, res) => {
                if (err) done(err);
                else if (res.statusCode === 200) {
                    let row = db.prepare('get', "SELECT votes FROM sponsorTimes WHERE UUID = ?", ["vote-uuid-0"]);
                    if (row.votes === 3) {
                        done();
                    } else {
                        done("Vote did not succeed. Submission went from 2 votes to " + row.votes);
                    }
                } else {
                    done("Status code was " + res.statusCode);
                }
            });
    });

    it('Should be able to downvote a segment', (done: Done) => {
        request.get(getbaseURL()
            + "/api/voteOnSponsorTime?userID=randomID2&UUID=vote-uuid-2&type=0", null,
            (err, res) => {
                if (err) done(err);
                else if (res.statusCode === 200) {
                    let row = db.prepare('get', "SELECT votes FROM sponsorTimes WHERE UUID = ?", ["vote-uuid-2"]);
                    if (row.votes < 10) {
                        done();
                    } else {
                        done("Vote did not succeed. Submission went from 10 votes to " + row.votes);
                    }
                } else {
                    done("Status code was " + res.statusCode);
                }
            });
    });

    it('Should not be able to downvote the same segment when voting from a different user on the same IP', (done: Done) => {
        request.get(getbaseURL()
            + "/api/voteOnSponsorTime?userID=randomID3&UUID=vote-uuid-2&type=0", null,
            (err, res) => {
                if (err) done(err);
                else if (res.statusCode === 200) {
                    let row = db.prepare('get', "SELECT votes FROM sponsorTimes WHERE UUID = ?", ["vote-uuid-2"]);
                    if (row.votes === 9) {
                        done();
                    } else {
                        done("Vote did not fail. Submission went from 9 votes to " + row.votes);
                    }
                } else {
                    done("Status code was " + res.statusCode);
                }
            });
    });

    it("Should not be able to downvote a segment if the user is shadow banned", (done: Done) => {
        request.get(getbaseURL()
            + "/api/voteOnSponsorTime?userID=randomID4&UUID=vote-uuid-1.6&type=0", null,
            (err, res) => {
                if (err) done(err);
                else if (res.statusCode === 200) {
                    let row = db.prepare('get', "SELECT votes FROM sponsorTimes WHERE UUID = ?", ["vote-uuid-1.6"]);
                    if (row.votes === 10) {
                        done();
                    } else {
                        done("Vote did not fail. Submission went from 10 votes to " + row.votes);
                    }
                } else {
                    done("Status code was " + res.statusCode);
                }
            });
    });

    it("Should not be able to upvote a segment if the user hasn't submitted yet", (done: Done) => {
        request.get(getbaseURL()
            + "/api/voteOnSponsorTime?userID=hasNotSubmittedID&UUID=vote-uuid-1&type=1", null,
            (err, res) => {
                if (err) done(err);
                else if (res.statusCode === 200) {
                    let row = db.prepare('get', "SELECT votes FROM sponsorTimes WHERE UUID = ?", ["vote-uuid-1"]);
                    if (row.votes === 2) {
                        done();
                    } else {
                        done("Vote did not fail. Submission went from 2 votes to " + row.votes);
                    }
                } else {
                    done("Status code was " + res.statusCode);
                }
            });
    });

    it("Should not be able to downvote a segment if the user hasn't submitted yet", (done: Done) => {
        request.get(getbaseURL()
            + "/api/voteOnSponsorTime?userID=hasNotSubmittedID&UUID=vote-uuid-1.5&type=0", null,
            (err, res) => {
                if (err) done(err);
                else if (res.statusCode === 200) {
                    let row = db.prepare('get', "SELECT votes FROM sponsorTimes WHERE UUID = ?", ["vote-uuid-1.5"]);
                    if (row.votes === 10) {
                        done();
                    } else {
                        done("Vote did not fail. Submission went from 10 votes to " + row.votes);
                    }
                } else {
                    done("Status code was " + res.statusCode);
                }
            });
    });

    it('VIP should be able to completely downvote a segment', (done: Done) => {
        request.get(getbaseURL()
            + "/api/voteOnSponsorTime?userID=VIPUser&UUID=vote-uuid-3&type=0", null,
            (err, res) => {
                if (err) done(err);
                else if (res.statusCode === 200) {
                    let row = db.prepare('get', "SELECT votes FROM sponsorTimes WHERE UUID = ?", ["vote-uuid-3"]);
                    if (row.votes <= -2) {
                        done();
                    } else {
                        done("Vote did not succeed. Submission went from 100 votes to " + row.votes);
                    }
                } else {
                    done("Status code was " + res.statusCode);
                }
            });
    });

    it('should be able to completely downvote your own segment', (done: Done) => {
        request.get(getbaseURL()
            + "/api/voteOnSponsorTime?userID=own-submission-id&UUID=own-submission-uuid&type=0", null,
            (err, res) => {
                if (err) done(err);
                else if (res.statusCode === 200) {
                    let row = db.prepare('get', "SELECT votes FROM sponsorTimes WHERE UUID = ?", ["own-submission-uuid"]);
                    if (row.votes <= -2) {
                        done();
                    } else {
                        done("Vote did not succeed. Submission went from 500 votes to " + row.votes);
                    }
                } else {
                    done("Status code was " + res.statusCode);
                }
            });
    });

    it('should not be able to completely downvote somebody elses segment', (done: Done) => {
        request.get(getbaseURL()
            + "/api/voteOnSponsorTime?userID=randomID2&UUID=not-own-submission-uuid&type=0", null,
            (err, res) => {
                if (err) done(err);
                else if (res.statusCode === 200) {
                    let row = db.prepare('get', "SELECT votes FROM sponsorTimes WHERE UUID = ?", ["not-own-submission-uuid"]);
                    if (row.votes === 499) {
                        done();
                    } else {
                        done("Vote did not succeed. Submission went from 500 votes to " + row.votes);
                    }
                } else {
                    done("Status code was " + res.statusCode);
                }
            });
    });

    it('Should be able to vote for a category and it should add your vote to the database', (done: Done) => {
        request.get(getbaseURL()
            + "/api/voteOnSponsorTime?userID=randomID2&UUID=vote-uuid-4&category=intro", null,
            (err, res) => {
                if (err) done(err);
                else if (res.statusCode === 200) {
                    let row = db.prepare('get', "SELECT category FROM sponsorTimes WHERE UUID = ?", ["vote-uuid-4"]);
                    let categoryRows = db.prepare('all', "SELECT votes, category FROM categoryVotes WHERE UUID = ?", ["vote-uuid-4"]);
                    if (row.category === "sponsor" && categoryRows.length === 2 
                            && categoryRows[0]?.votes === 1 && categoryRows[0]?.category === "intro"
                                && categoryRows[1]?.votes === 1 && categoryRows[1]?.category === "sponsor") {
                        done();
                    } else {
                        done("Submission changed to " + row.category + " instead of staying as sponsor. Vote was applied as " + categoryRows[0]?.category + " with " + categoryRows[0]?.votes + " votes and there were " + categoryRows.length + " rows.");
                    }
                } else {
                    done("Status code was " + res.statusCode);
                }
            });
    });

    it('Should not able to change to an invalid category', (done: Done) => {
        request.get(getbaseURL()
            + "/api/voteOnSponsorTime?userID=randomID2&UUID=incorrect-category&category=fakecategory", null,
            (err, res) => {
                if (err) done(err);
                else if (res.statusCode === 400) {
                    let row = db.prepare('get', "SELECT category FROM sponsorTimes WHERE UUID = ?", ["incorrect-category"]);
                    if (row.category === "sponsor") {
                        done();
                    } else {
                        done("Vote did not succeed. Submission went from sponsor to " + row.category);
                    }
                } else {
                    done("Status code was " + res.statusCode);
                }
            });
    });

    it('Should be able to change your vote for a category and it should add your vote to the database', (done: Done) => {
        request.get(getbaseURL()
            + "/api/voteOnSponsorTime?userID=randomID2&UUID=vote-uuid-4&category=outro", null,
            (err, res) => {
                if (err) done(err);
                else if (res.statusCode === 200) {
                    let submissionRow = db.prepare('get', "SELECT category FROM sponsorTimes WHERE UUID = ?", ["vote-uuid-4"]);
                    let categoryRows = db.prepare('all', "SELECT votes, category FROM categoryVotes WHERE UUID = ?", ["vote-uuid-4"]);
                    let introVotes = 0;
                    let outroVotes = 0;
                    let sponsorVotes = 0;
                    for (const row of categoryRows) {
                        if (row?.category === "intro") introVotes += row?.votes;
                        if (row?.category === "outro") outroVotes += row?.votes;
                        if (row?.category === "sponsor") sponsorVotes += row?.votes;
                    }
                    if (submissionRow.category === "sponsor" && categoryRows.length === 3 
                            && introVotes === 0 && outroVotes === 1 && sponsorVotes === 1) {
                        done();
                    } else {
                        done("Submission changed to " + submissionRow.category + " instead of staying as sponsor. There were " 
                                + introVotes + " intro votes, " + outroVotes + " outro votes and " + sponsorVotes + " sponsor votes.");
                    }
                } else {
                    done("Status code was " + res.statusCode);
                }
            });
    });


    it('Should not be able to change your vote to an invalid category', (done: Done) => {
        const vote = (inputCat: string, assertCat: string, callback: Done) => {
            request.get(getbaseURL()
                + "/api/voteOnSponsorTime?userID=randomID2&UUID=incorrect-category-change&category=" + inputCat, null,
                (err) => {
                    if (err) done(err);
                    else {
                        let row = db.prepare('get', "SELECT category FROM sponsorTimes WHERE UUID = ?", ["incorrect-category-change"]);
                        if (row.category === assertCat) {
                            callback();
                        } else {
                            done("Vote did not succeed. Submission went from sponsor to " + row.category);
                        }
                    }
                });
        };
        vote("sponsor", "sponsor", () => {
            vote("fakeCategory", "sponsor", done);
        });
    });


    it('VIP should be able to vote for a category and it should immediately change', (done: Done) => {
        request.get(getbaseURL()
            + "/api/voteOnSponsorTime?userID=VIPUser&UUID=vote-uuid-5&category=outro", null,
            (err, res) => {
                if (err) done(err);
                else if (res.statusCode === 200) {
                    let row = db.prepare('get', "SELECT category FROM sponsorTimes WHERE UUID = ?", ["vote-uuid-5"]);
                    let row2 = db.prepare('get', "SELECT votes FROM categoryVotes WHERE UUID = ? and category = ?", ["vote-uuid-5", "outro"]);
                    if (row.category === "outro" && row2.votes === 500) {
                        done();
                    } else {
                        done("Vote did not succeed. Submission went from intro to " + row.category + ". Category votes are " + row2.votes + " and should be 500.");
                    }
                } else {
                    done("Status code was " + res.statusCode);
                }
            });
    });

    it('Submitter should be able to vote for a category and it should immediately change', (done: Done) => {
        request.get(getbaseURL()
            + "/api/voteOnSponsorTime?userID=testman&UUID=vote-uuid-5_1&category=outro", null,
            (err, res) => {
                if (err) done(err);
                else if (res.statusCode === 200) {
                    let row = db.prepare('get', "SELECT category FROM sponsorTimes WHERE UUID = ?", ["vote-uuid-5"]);
                    if (row.category === "outro") {
                        done();
                    } else {
                        done("Vote did not succeed. Submission went from intro to " + row.category + ".");
                    }
                } else {
                    done("Status code was " + res.statusCode);
                }
            });
    });

    it('Should not be able to category-vote on an invalid UUID submission', (done: Done) => {
        request.get(getbaseURL()
            + "/api/voteOnSponsorTime?userID=randomID3&UUID=invalid-uuid&category=intro", null,
            (err, res) => {
                if (err) done(err);
                else if (res.statusCode === 400) {
                    done();
                } else {
                    done("Status code was " + res.statusCode + " instead of 400.");
                }
            });
    });

    it('Non-VIP should not be able to upvote "dead" submission', (done: Done) => {
        request.get(getbaseURL()
            + "/api/voteOnSponsorTime?userID=randomID2&UUID=vote-uuid-5&type=1", null,
            (err, res) => {
                if (err) done(err);
                else if (res.statusCode === 403) {
                    done();
                } else {
                    done("Status code was " + res.statusCode + " instead of 403");
                }
            });
    });

    it('VIP should be able to upvote "dead" submission', (done: Done) => {
        request.get(getbaseURL()
            + "/api/voteOnSponsorTime?userID=VIPUser&UUID=vote-uuid-5&type=1", null,
            (err, res) => {
                if (err) done(err);
                else if (res.statusCode === 200) {
                    let row = db.prepare('get', "SELECT votes FROM sponsorTimes WHERE UUID = ?", ["vote-uuid-5"]);
                    if (row.votes > -3) {
                        done();
                    } else {
                        done("Vote did not succeed. Votes raised from -3 to " + row.votes);
                    }
                } else {
                    done("Status code was " + res.statusCode);
                }
            });
    });

    it('Should not be able to upvote a segment (Too many warning)', (done: Done) => {
        request.get(getbaseURL()
            + "/api/voteOnSponsorTime?userID=warn-voteuser01&UUID=warnvote-uuid-0&type=1", null,
            (err, res) => {
                if (err) done(err);
                else if (res.statusCode === 403) {
                    done(); // success
                } else {
                    done("Status code was " + res.statusCode);
                }
            });
    });

    it('Non-VIP should not be able to vote on a segment with no-segments category', (done: Done) => {
        request.get(getbaseURL()
            + "/api/voteOnSponsorTime?userID=no-segments-voter&UUID=no-sponsor-segments-uuid-0&type=1", null,
            (err, res) => {
                if (err) done(err);
                else if (res.statusCode === 403) {
                    done();
                } else {
                    done("Status code was " + res.statusCode + " instead of 403");
                }
            });
    });

    it('Non-VIP should not be able to category vote on a segment with no-segments category', (done: Done) => {
        request.get(getbaseURL()
            + "/api/voteOnSponsorTime?userID=no-segments-voter&UUID=no-sponsor-segments-uuid-0&category=outro", null,
            (err, res) => {
                if (err) done(err);
                else if (res.statusCode === 403) {
                    done();
                } else {
                    done("Status code was " + res.statusCode + " instead of 403");
                }
            });
    });

    it('VIP should able to vote on a segment with no-segments category', (done: Done) => {
        request.get(getbaseURL()
            + "/api/voteOnSponsorTime?userID=VIPUser&UUID=no-sponsor-segments-uuid-0&type=1", null,
            (err, res) => {
                if (err) done(err);
                else if (res.statusCode === 200) {
                    done();
                } else {
                    done("Status code was " + res.statusCode + " instead of 200");
                }
            });
    });

    it('Non-VIP should be able to vote on a segment on a no-segments video with a category that doesn\'t have no-segments', (done: Done) => {
        request.get(getbaseURL()
            + "/api/voteOnSponsorTime?userID=no-segments-voter&UUID=no-sponsor-segments-uuid-1&type=1", null,
            (err, res) => {
                if (err) done(err);
                else if (res.statusCode === 200) {
                    done();
                } else {
                    done("Status code was " + res.statusCode + " instead of 200");
                }
            });
    });

});
