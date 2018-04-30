require('./App');

window.log = () => {};

const wait = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 100);
    });
};

it('timeEnd should return 100 - 115', async () => {
    window.timeStart('test');
    await wait();
    const actual = window.timeEnd('test');
    expect(actual).toBeGreaterThanOrEqual(100);
    expect(actual).toBeLessThanOrEqual(180);
});
