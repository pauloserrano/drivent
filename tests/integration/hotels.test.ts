/*
GET /hotels/:hotelId?
    - should respond with status 401 if no token is given
    - should respond with status 401 if given token isn't valid
    - should respond with status 401 if given token has no session

  When token is valid
      - should respond with status 403 if user has no enrollment yet
      - should respond with status 404 if given hotel id doesn't exist
      - should respond with status 404 if related ticket doesn't exist
      - should respond with status 401 if user doesn't own related ticket
      - should respond with status 402 if related ticket isn't paid
      - should respond with status 400 if related ticketType doesn't include hotel or is remote
      - should respond with status 200 and hotels data if no hotel id was given
      - should respond with status 200 and hotel data if a valid hotel id was given
*/
