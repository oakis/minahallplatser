// import {handleJsonFetch} from '@helpers';

export const updateDeparturesCount = count => {
  if (__DEV__) {
    return;
  }
  // const url = `${firebaseFunctionsUrl}/addDeparturesCount?count=${count}`;
  // fetch(url, {}, 'updateDeparturesCount')
  //   .then(handleJsonFetch)
  //   .then(({message}) => {
  //     window.log(`updateDeparturesCount(): OK (${message})`);
  //   })
  //   .catch(err => {
  //     window.log(`updateDeparturesCount(): FAILED' ${err})`);
  //   });
};

export const updateStopsCount = () => {
  if (__DEV__) {
    return;
  }
  // const url = `${firebaseFunctionsUrl}/addStopsCount`;
  // fetch(url, {}, 'updateStopsCount')
  //   .then(handleJsonFetch)
  //   .then(({message}) => {
  //     window.log('updateStopsCount(): OK', message);
  //   })
  //   .catch(err => {
  //     window.log('updateStopsCount(): FAILED', err);
  //   });
};
