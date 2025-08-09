export default async function openEnvironment(history: [[string, string][][], [string, string][], [string, string][], [string, number][]]): Promise<any> {
    const environment = history[0]
    const actor: string[][] = history[2]
    const action = new Map(history[3])
    const time: Map<string, number> = new Map(history[3]);

    return new Promise((resolve, reject) => {
        if (!environment) reject(environment)
        if (!actor) reject(environment)
        if (!action) reject(environment)
        const path = async (path: string, context: string) => {
            console.log(path, context)

            const edges = new Map([
                ["environment", "actor"],
                ["environment", "action"],
                ["environment", "time"],
                ["actor", "action"],
                ["actor", "time"],
                ["action", "time"]
            ]);
            const steps = path.split("/")
            steps.forEach((step) => {
                console.log(step);
            })
            return path
        }
        resolve(path);
    })
};
