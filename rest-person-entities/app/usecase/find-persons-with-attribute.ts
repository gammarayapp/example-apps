import { FuncVisibility } from 'gammaray-app/core';
import { HttpFunc, HttpStatus } from 'gammaray-app/http';
import { EntityQueryFinishedFunc } from 'gammaray-app/query';
import { Person } from '../entity/person/person';
import { CollectFinish, EntityMapper, collectAndMap } from '../gammaray-tools';

/*
This demonstrates the query feature for an entity type, which needs to be enabled explicitely (see person-config.ts).
*/

/*
A public stateless function that contains a REST definition for querying for Person entities.
*/
export const findPersonsWithAttribute: HttpFunc<never> = {
  vis: FuncVisibility.pub,
  rest: {
    method: "GET",
    path: [{ name: "person" }],
    description: "Finds all persons with a specific attribute",
    params: [
      {
        in: "query",
        name: "attr",
      },
      {
        in: "query",
        name: "val",
      },
    ],
  },
  func(lib, params, ctx)
  {
    // Getting the values for the attribute that we want to query for and the value that it has to have.
    const attr = params.getQueryParam("attr");
    const val = params.getQueryParam("val");

    /*
    Starting the query for Person entities.
    We also pass in the function that is supposed to be called when the query has finished "findPersonsWithAttribute1"
    and the actual query definition stating that the attribute has to match exactly the given value.
    */
    lib.entityQueries.query("person", "findPersonsWithAttribute1", {
      attributes: [
        { name: attr!, value: { match: val } },
      ],
    }, ctx);
  },
};

/*
This will be called when the query has finished.
*/
export const findPersonsWithAttribute1: EntityQueryFinishedFunc<never> = {
  vis: FuncVisibility.pri,
  func(lib, params, ctx)
  {
    if (params.ids.length === 0)
    {
      ctx.sendResponse({ persons: [] });
      return;
    }

    /*
    The result of a query will always be just the ids of the matching entities.
    It is up to you what to do with it depending on the specific requirements.
    With those ids you can now access each entity the given way through calling an entity function for each id.
    To make this example look more complete and "SELECT *"-SQL like we've added a simple tool for reading each Person entity also with an optional mapper.
    "collectAndMap" does what it states: It accesses all given entities and maps them if wanted and you can specify the usual function to be called when the whole process has finished.
    The only thing that needs to be done outside of this file or use case is to define the entity function that is reading the actual entity. In "person-config.ts" you will see the declaration of "collectPersons".
    */

    collectAndMap(lib.entityFunc, "person", params.ids, "collectPersons", {}, ctx);
  },
};

/*
We're not mapping anything here and just want the full Person entity - so we just return it as is.
*/
export const personToResourceMapper: EntityMapper<Person> = (id, entity) =>
{
  return entity;
}

export const findPersonsWithProperty2: CollectFinish = (entities, params, lib, ctx) =>
{
  /*
  "entities" is an array of all the objects returned in the mapper. So we can finally send them to the client.
  */

  ctx.sendResponse({ persons: entities }, { status: HttpStatus.OK });
}
