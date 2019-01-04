import moment from 'moment'
import {clone, cloneDeep, maxBy, min, max} from 'lodash'


function getLatest(data) {
  return maxBy(data, (d) => d.date)
}

function getLatestValues(data) {
  return clone(getLatest(data).values);
}

function getDateRange(data) {
  const dates = data.map((d) => d.date)
  return [min(dates), max(dates)];
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
  const cats = data[data.length-1].values.map((el) => {
    return {
      name: el.name,
      id: el.name
    }
  });
  cats.map((cat) => {
    cat.data = data.map((d) => {
      const app = d.values.find((x) => x.name === cat.name)
      if (!app) {
        return {
          name: cat.name,
          date: d.date,
          count: 0
        }
      }
      return {
        name: cat.name,
        date: d.date,
        count: app.count
      }
    });
   });
   return cats;
}

function sortCategoriesByLatestCount(categories) {
  categories.sort((a, b) => {
    return getLatest(b.data).count - getLatest(a.data).count;
  });
}

export {
  parseDates, getDateRange, getLatestValues, 
  removeHttpFromNames, getDataByDate, getCategories, 
  sortCategoriesByLatestCount, includeOnly};