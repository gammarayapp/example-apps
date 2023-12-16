import { EntityType } from 'gammaray-app/core';
import { createEntityCollector } from '../../gammaray-tools';
import { createPerson1 } from '../../usecase/create-person';
import { findPersonsWithProperty2, personToResourceMapper } from '../../usecase/find-persons-with-attribute';
import { getPerson1 } from '../../usecase/get-person-by-id';
import { Person } from './person';

export const personConfig: EntityType<Person> = {
  currentVersion: 1,

  /*
  With this we enable automatic indexing for this entity type, meaning that it can be found not just by the id, but also by other attributes.
  There is only a "SIMPLE" mode right now which makes the entity queryable by all its top level primitive attributes (firstName, lastName, weight and isActive).
  */
  index: {
    mode: "SIMPLE",
  },

  // All entity functions for the entity type "person" need to be added here.
  func: {
    createPerson1,
    getPerson1,
    collectPersons: createEntityCollector("person", "collectPersons", personToResourceMapper, findPersonsWithProperty2),
  },
};
