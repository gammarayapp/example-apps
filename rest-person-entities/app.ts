import { GammarayApp } from "gammaray-app/core";
import { personConfig } from './app/entity/person/person-config';
import { createPerson } from "./app/usecase/create-person";
import { findPersonsWithAttribute, findPersonsWithAttribute1 } from './app/usecase/find-persons-with-attribute';
import { getPerson } from "./app/usecase/get-person-by-id";

/*
This is a design suggestion about how to organize a project.
There are some explanations in this project and some are left out since the documentation should be in the "gammaray-app" package.
All (business) use cases (public functions or HTTP/REST endpoints) that this application covers is in the directory app/usecase. Each file represents one use case which is also named accordingly.
*/

/*
This is basically the entrypoint to this application.
An object named "app" of type GammarayApp needs to be defined in this file "app.ts".
Everything else can be done in separate files as long as they are added to the respective place in that structure.
*/
export const app: GammarayApp = {
  func: {
    createPerson,
    getPerson,
    findPersonsWithAttribute,
    findPersonsWithAttribute1,
  },

  /*
  This application just covers one business entity called Person.
  Also the whole definition for this entity type (personConfig) is in another file to keep this one cleaned up.
  */
  entity: {
    person: personConfig,
  },
};
