import request from 'request';
import {db} from '../../src/databases/databases';
import {Done, getbaseURL} from '../utils';
import {getHash} from '../../src/utils/getHash';
/*
 *CREATE TABLE IF NOT EXISTS "sponsorTimes" (
	"videoID"	TEXT NOT NULL,
	"startTime"	REAL NOT NULL,
	"endTime"	REAL NOT NULL,
	"votes"	INTEGER NOT NULL,
	"UUID"	TEXT NOT NULL UNIQUE,
	"userID"	TEXT NOT NULL,
	"timeSubmitted"	INTEGER NOT NULL,
	"views"	INTEGER NOT NULL,
	"shadowHidden"	INTEGER NOT NULL
);
 */

describe('getVideoSponsorTime (Old get method)', () => {
    before(() => {
        let startOfQuery = "INSERT INTO sponsorTimes (videoID, startTime, endTime, votes, UUID, userID, timeSubmitted, views, category, shadowHidden, hashedVideoID) VALUES";
        db.exec(startOfQuery + "('old-testtesttest', 1, 11, 2, 'uuid-0', 'testman', 0, 50, 'sponsor', 0, '" + getHash('old-testtesttest', 1) + "')");
        db.exec(startOfQuery + "('old-testtesttest,test', 1, 11, 2, 'uuid-1', 'testman', 0, 50, 'sponsor', 0, '" + getHash('old-testtesttest,test', 1) + "')");
    });

    it('Should be able to get a time', (done: Done) => {
        request.get(getbaseURL()
            + "/api/getVideoSponsorTimes?videoID=old-testtesttest", null,
            (err, res) => {
                if (err) done("Couldn't call endpoint");
                else if (res.statusCode !== 200) done("non 200");
                else done(); // pass
            });
    });

    it('Should return 404 if no segment found', (done: Done) => {
        request.get(getbaseURL()
            + "/api/getVideoSponsorTimes?videoID=notarealvideo", null,
            (err, res) => {
                if (err) done("couldn't call endpoint");
                else if (res.statusCode !== 404) done("non 404 respone code: " + res.statusCode);
                else done(); // pass
            });
    });


    it('Should be possible to send unexpected query parameters', (done: Done) => {
        request.get(getbaseURL()
            + "/api/getVideoSponsorTimes?videoID=old-testtesttest&fakeparam=hello", null,
            (err, res) => {
                if (err) done("couldn't callendpoint");
                else if (res.statusCode !== 200) done("non 200");
                else done(); // pass
            });
    });

    it('Should be able send a comma in a query param', (done: Done) => {
        request.get(getbaseURL()
            + "/api/getVideoSponsorTimes?videoID=old-testtesttest,test", null,
            (err, res, body) => {
                if (err) done("couln't call endpoint");
                else if (res.statusCode !== 200) done("non 200 response: " + res.statusCode);
                else if (JSON.parse(body).UUIDs[0] === 'uuid-1') done(); // pass
                else done("couldn't parse response");
            });
    });

    it('Should be able to get the correct time', (done: Done) => {
        request.get(getbaseURL()
            + "/api/getVideoSponsorTimes?videoID=old-testtesttest", null,
            (err, res, body) => {
                if (err) done("couldn't call endpoint");
                else if (res.statusCode !== 200) done("non 200");
                else {
                    let parsedBody = JSON.parse(body);
                    if (parsedBody.sponsorTimes[0][0] === 1
                        && parsedBody.sponsorTimes[0][1] === 11
                        && parsedBody.UUIDs[0] === 'uuid-0') {
                        done(); // pass
                    } else {
                        done("Wrong data was returned + " + parsedBody);
                    }
                }

            });
    });
});
