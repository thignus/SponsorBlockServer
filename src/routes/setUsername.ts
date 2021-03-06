import {config} from '../config';
import {Logger} from '../utils/logger';
import {db} from '../databases/databases';
import {getHash} from '../utils/getHash';
import {Request, Response} from 'express';

export function setUsername(req: Request, res: Response) {
    let userID = req.query.userID as string;
    let userName = req.query.username as string;

    let adminUserIDInput = req.query.adminUserID as string;

    if (userID == undefined || userName == undefined || userID === "undefined" || userName.length > 64) {
        //invalid request
        res.sendStatus(400);
        return;
    }

    if (userName.includes("discord")) {
        // Don't allow
        res.sendStatus(200);
        return;
    }

    if (adminUserIDInput != undefined) {
        //this is the admin controlling the other users account, don't hash the controling account's ID
        adminUserIDInput = getHash(adminUserIDInput);

        if (adminUserIDInput != config.adminUserID) {
            //they aren't the admin
            res.sendStatus(403);
            return;
        }
    } else {
        //hash the userID
        userID = getHash(userID);
    }

    try {
        //check if username is already set
        let row = db.prepare('get', "SELECT count(*) as count FROM userNames WHERE userID = ?", [userID]);

        if (row.count > 0) {
            //already exists, update this row
            db.prepare('run', "UPDATE userNames SET userName = ? WHERE userID = ?", [userName, userID]);
        } else {
            //add to the db
            db.prepare('run', "INSERT INTO userNames VALUES(?, ?)", [userID, userName]);
        }

        res.sendStatus(200);
    } catch (err) {
        Logger.error(err);
        res.sendStatus(500);

        return;
    }
}
