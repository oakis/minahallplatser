import moment from 'moment';
import {stub} from 'sinon';
import {getDepartures} from './departures.ts';

global.fetch = jest.fn();

const date = moment().format('YYYY-MM-DD');
const time = moment().format('HH:mm');
const accessToken = 123;
const url = `https://api.vasttrafik.se/bin/rest.exe/v2/departureBoard?id=1&date=${date}&time=${time}&format=json&timeSpan=90&maxDeparturesPerLine=2&needJourneyDetail=0`;
const url2 = `https://api.vasttrafik.se/bin/rest.exe/v2/departureBoard?id=1&date=${date}&time=${time}&format=json&timeSpan=1440&maxDeparturesPerLine=2&needJourneyDetail=0`;
const config = {
  method: 'get',
  headers: {
    Accept: 'application/json',
    Authorization: `Bearer ${accessToken}`,
  },
};

it('should fetch departures 24 hours in the future if no departure is found within 90 min', async () => {
  const dispatch = jest.fn();
  global.fetch.mockImplementationOnce(() => ({
    finally: stub().resolves({error: 'No journeys found'}),
    then: stub().resolves({error: 'No journeys found'}),
    catch: stub().rejects({error: 'No journeys found'}),
  }));
  await getDepartures({id: 1})(dispatch);
  process.nextTick(() => {
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenCalledWith(url, config, 'getDepartures');
    expect(fetch).toHaveBeenCalledWith(url2, config, 'getDepartures');
  });
});
