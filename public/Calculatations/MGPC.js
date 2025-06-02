const W1 = 0.18; 
const W2 = 0.20; 
const W3 = 0.18; 
const W4 = 0.14;
const W5 = 0.14; 
const W6 = 0.16; 

export class MGPC {
    constructor({ genreA, genreB }) {
        const {
            bpmL: bpmAL,
            bpmU: bpmAU,
            mode: modeA,
            metric: metricA,
            tone: toneA,
            avrSongDuration: avrSongDurationA,
            volume: volumeA
        } = genreA;

        const {
            bpmL: bpmBL,
            bpmU: bpmBU,
            mode: modeB,
            metric: metricB,
            tone: toneB,
            avrSongDuration: avrSongDurationB,
            volume: volumeB
        } = genreB;

        const bpmA = (bpmAL + bpmAU) / 2;
        const bpmB = (bpmBL + bpmBU) / 2;

        this.genreA = {
            bpm: bpmA,
            mode: modeA,
            metric: metricA,
            tone: toneA,
            avrSongDuration: avrSongDurationA,
            volume: volumeA
        };

        this.genreB = {
            bpm: bpmB,
            mode: modeB,
            metric: metricB,
            tone: toneB,
            avrSongDuration: avrSongDurationB,
            volume: volumeB
        };
    }

    modeDistance(modeA, modeB) {
        return Math.abs(modeA - modeB);
    }

    bpmDistance(bpmA, bpmB) {
        return Math.abs(bpmA - bpmB) / 250;
    }

    toneDistance(toneA, toneB) {
        return (toneA === -1 || toneB === -1) 
            ? 0 
            : Math.min(Math.abs(toneA - toneB), 12 - Math.abs(toneA - toneB)) / 6;
    }

    volumeDistance(volA, volB) {
        return Math.abs(volA - volB) / 60;
    }

    durationDistance(durationA, durationB) {
        return Math.abs(durationA - durationB) / 3600;
    }

    metricDistance(metricA, metricB) {
        return (metricA === 0 || metricB === 0) 
            ? 0 
            : Math.abs(metricA - metricB) / 6;
    }

    MGPC() {
        const modeD = this.modeDistance(this.genreA.mode, this.genreB.mode);
        const bpmD = this.bpmDistance(this.genreA.bpm, this.genreB.bpm);
        const toneD = this.toneDistance(this.genreA.tone, this.genreB.tone);
        const volD = this.volumeDistance(this.genreA.volume, this.genreB.volume);
        const durD = this.durationDistance(this.genreA.avrSongDuration, this.genreB.avrSongDuration);
        const metD = this.metricDistance(this.genreA.metric, this.genreB.metric);

        console.log('modeD:', modeD);
        console.log('bpmD:', bpmD);
        console.log('toneD:', toneD);
        console.log('volD:', volD);
        console.log('durD:', durD);
        console.log('metD:', metD);


        console.log(this.genreA)
        return 1 - Math.sqrt(
            W1 * modeD ** 2 +
            W2 * bpmD ** 2 +
            W3 * toneD ** 2 +
            W4 * volD ** 2 +
            W5 * durD ** 2 +
            W6 * metD ** 2
        );
    }
}
