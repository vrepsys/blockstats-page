import moment from 'moment'
import {clone, cloneDeep, maxBy} from 'lodash'

function getLatestValues(data) {
  return clone(maxBy(data, (d) => d.date).values);
}

function removeHttpFromNames(data) {
  data.forEach((d) => {
    d.values.forEach((v) => {
       v.name = v.name.replace(/^https?\:\/\//i, "");
    });
  });
}

function parseDates(data) {
  data.forEach((d) => {
    d.date = moment(d.date).utc().toDate()
    d.values.forEach((app) => app.date = d.date)
  })
}

function includeOnly(data, categories) {
  data = cloneDeep(data);
  return data.map( (d) => {
    d.values = d.values.filter((v) => {
      return categories.includes(v.name);
    });
    return d;
  });
}

function getDataByDate(data) {
  return new Map(data.map((datum) => [datum.date, datum.values.sort((a, b) => a.count < b.count)]));
}

function getCategories(data) {
  const cats = data[0].values.map((el) => {
    return {
      name: el.name,
      id: el.name
    }
  });
  cats.map((cat) => {
    cat.data = data.map((d) => {
      const app = d.values.find((x) => x.name === cat.name)
      return {
        name: cat.name,
        date: d.date,
        count: app.count
      }
    });
   });
   return cats;
}

export {parseDates, getLatestValues, removeHttpFromNames, getDataByDate, getCategories, includeOnly};