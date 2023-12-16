import { EntityFunc, FuncVisibility } from "gammaray-app/core";
import { HttpFunc, HttpStatus } from "gammaray-app/http";
import { Person } from "../entity/person/person";

/*
The JSON definition of the request body.
*/
interface Params
{
  firstName: string;
  lastName: string;
  weight: number;
}

/*
A public stateless function that contains a REST definition for creating a Person entity.
*/
export const createPerson: HttpFunc<Params> = {
  vis: FuncVisibility.pub,
  rest: {
    method: "POST",
    path: [{ name: "person" }],
    description: "Creates a new person",
    params: [{
      name: "person",
      in: "body",
      description: "The attributes of the person",
      schema: {
        firstName: {
          type: "string",
        },
        lastName: {
          type: "string",
        },
        weight: {
          type: "integer",
        },
      },
    }],
  },
  func(lib, params, ctx)
  {
    /*
    The only thing this function does is generating an id for the new Person and calling another private function called "createPerson1".
    The entity type needs to be the same name that is used in the app definition (app.entity) which is "person".
    The function context always needs to be passed through the whole use case. It contains information about the current request and besided other info it is needed to send a response back in the last function.
    It is a good practice to keep the names of all functions belonging to one use case the same and just add the number of the order they are called.
    */
    lib.entityFunc.invoke("person", "createPerson1", lib.tools.generateEntityId(), params.body, ctx);
  },
};

/*
This is an entity function. It has the entity with the given id as a parameter so you can do something with it as long as you do it inside of the scope of this function.
*/
export const createPerson1: EntityFunc<Person, Params> = {
  vis: FuncVisibility.pri,
  func(person, id, lib, params, ctx)
  {
    // We just generated the id for this entity randomly, so we are sure that it doesn't exist yet and we have to create it using the request payload from the previous function.
    person = {
      firstName: params.firstName,
      lastName: params.lastName,
      weight: params.weight,
      isActive: true,
    };

    // Sends a response back to the client with the id and the respective http status code.
    ctx.sendResponse({ id }, { status: HttpStatus.CREATED });

    // By returning the entity we're indicating that we created or modified it. The application server will take care of the persistency for it.
    return person;
  },
};
