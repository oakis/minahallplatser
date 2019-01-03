require('./setupLogging');

window.log = () => {};

const wait = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 100);
    });
};

it('timeEnd should return at least 100', async () => {
    window.timeStart('test');
    await wait();
    const actual = window.timeEnd('test');
    expect(actual).toBeGreaterThanOrEqual(100);
});
