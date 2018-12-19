import { AssetQuote } from '../types/asset-quote';

export class QuotesStorage {
    private STORAGE_KEY = 'quotes';

    private checkSanity(quotes: AssetQuote[]) {
        if (quotes.length % 4 !== 0) {
            throw new Error(`Quotes length is expected to be multiple of 4, but is: ${quotes.length}`);
        }

        const uniqueDates = Array.from(new Set(quotes.map(q => q.date.getTime())));
        for (let i = 0, d = new Date(uniqueDates[0]); d.getTime() === uniqueDates[i];
                ++i, d.setDate(d.getDate() + 1)) {
            const dateQuotes = quotes.filter(q => q.date.getTime() === d.getTime());
            if (dateQuotes.length !== 4) {
                console.log('incomplete quotes for date: ', d.toISOString().substr(0, 10), dateQuotes);
            }
        }

        if (uniqueDates.length * 4 !== quotes.length) {
            throw new Error(`Should be 4 quotes per date, but there are ${quotes.length} quotes` +
                ` and ${uniqueDates.length} dates`);
        }
    }

    loadQuotes(): Promise<AssetQuote[]> {
        return new Promise((resolve) => {
            const quotes: AssetQuote[] = (JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [])
                .map(q => AssetQuote.deserialize(q));
            this.checkSanity(quotes);
            resolve(quotes);
        });
    }

    addQuotes(quotes: AssetQuote[]): Promise<AssetQuote[]> {
        return this.loadQuotes().then((stored: AssetQuote[]) => {
            stored.push(...quotes);
            this.checkSanity(stored);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stored));
            return stored;
        });
    }

    clear(): Promise<boolean> {
        localStorage.removeItem(this.STORAGE_KEY);
        return Promise.resolve(true);
    }
}
