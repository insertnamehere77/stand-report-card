

export interface StandStats {
    power: number;
    speed: number;
    range: number;
    stamina: number;
    precision: number;
    potential: number;
}

function sumUsingOffset(data: Uint8Array, offset: number): number {
    let total = 0;
    for (let i = 0; i < data.length; i += offset) {
        total += data[i];
    }
    return total;
}


//LCG algo based on this : https://en.wikipedia.org/wiki/Linear_congruential_generator
function* lcgRandom(seed: number): Generator<number, number, number> {
    const a = 25214903917;
    const c = 11;
    const mod = 2 ^ 48;
    while (true) {
        seed = (a * seed + c) % mod;
        yield seed / mod;
    }
}



function generateSingleStat(randGen: Generator<number, number, number>): number {
    const randNum = Math.round(1 + (randGen.next().value * 4));
    return randNum;
}


export function generateStats(dataView: Uint8Array): StandStats {
    const seed = sumUsingOffset(dataView, 3);
    const randGen = lcgRandom(seed);

    return {
        power: generateSingleStat(randGen),
        speed: generateSingleStat(randGen),
        range: generateSingleStat(randGen),
        stamina: generateSingleStat(randGen),
        precision: generateSingleStat(randGen),
        potential: generateSingleStat(randGen)
    }
}