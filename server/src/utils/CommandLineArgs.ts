type CommandLineArgs = {
    mode: "cluster" | "normal",
};

type CommandLineArgKey = keyof CommandLineArgs;

export const CommandLineArgs = (argv: string[]): CommandLineArgs => {
    const args: CommandLineArgs = {
        mode: "normal",
    };

    try {
        console.log({ argv });

        const extractedArgs = argv.splice(2);

        console.log({ extractedArgs });

        if (!extractedArgs?.length)
            return {
                mode: "normal"
            };
    
        for (const extractedArg of extractedArgs) {
            const argsKeyValue = extractedArg?.split("=");
            
            if (!argsKeyValue || argsKeyValue?.length < 2)
                continue;

            const [key , value] = argsKeyValue as [CommandLineArgKey, any];

            console.log({ key, value });

            switch (key) {
                case "mode":
                    if (["cluster", "normal"].includes(value))
                        args.mode = value;
                    continue;
                default:
                    continue;
            }
        }

    } catch (err) {
        console.log("ERROR PARSING ARGS:", err);
    }

    return args;
};

