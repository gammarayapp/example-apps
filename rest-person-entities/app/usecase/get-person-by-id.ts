import { EntityFunc, FuncVisibility } from "gammaray-app/core";
import { HttpFunc, HttpStatus } from "gammaray-app/http";
import { Person } from "../entity/person/person";

/*
A public stateless function that contains a REST definition for getting a Person entity by its id.
*/
export const getPerson: HttpFunc<never> = {
  vis: FuncVisibility.pub,
  rest: {
    method: "GET",
    path: [{ name: "person" }, { name: "id", isVar: true }], // The id is a path parameter...
    description: "Gets a person by its id",
    params: [
      {
        in: "path",
        name: "id",
      },
    ],
  },
  func(lib, params, ctx)
  {
    const id = params.getPathParam("id"); // ...and can be read like so
    if (!id)
    {
      // It is a bad request in case the id hasn't been specified
      ctx.sendResponse({}, { status: HttpStatus.BAD_REQUEST });
      return;
    }

    // Calls the entity function "getPerson1", which is declared just below, addressing the given id
    lib.entityFunc.invoke("person", "getPerson1", id, null, ctx);
  },
};

/*
This is an entity function. It has the entity with the given id as a parameter so you can do something with it as long as you do it inside of the scope of this function.
*/
export const getPerson1: EntityFunc<Person, never> = {
  vis: FuncVisibility.pri,
  func(person, id, lib, params, ctx)
  {
    if (!person)
    {
      // The response http status code in case it couldn't be found.
      ctx.sendResponse({}, { status: HttpStatus.NOT_FOUND });
      return;
    }

    // For simplity reasons just send the whole entity - usually you would map here into a specific response type.
    ctx.sendResponse(person, { status: HttpStatus.OK });
  },
};
