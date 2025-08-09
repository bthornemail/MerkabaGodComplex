/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */

import { useState, useEffect } from 'react'
import { AceBase } from 'acebase'

export const useAceBase = (name: string) => {
    const [db, setDb] = useState<AceBase>()

        async function startDB(dbName: string) {
            try {
                // Create an AceBase db using IndexedDB
                const options: any = { logLevel: 'log', storage: { path: `../db/${dbName}`}, multipleTabs: true , transactions: { log: true, maxAge: 30, noWait: false } }; // optional settings
                const db = new AceBase(dbName, options);

                await db.ready();
                console.log('Database ready to use');
                setDb(db)

            } catch (e) {
                const db = AceBase.WithIndexedDB(dbName);

                await db.ready();
                console.log('Database ready to use');
                setDb(db)
                // console.error(e)
            }
        }
    useEffect(() => {
        startDB(name)
    }, [name])

    return { db }
}
