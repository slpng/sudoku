FROM node:20.1.0

WORKDIR /code

RUN npm install -g nodemon

COPY package*.json .
RUN npm install

# COPY prisma/ prisma/
# RUN npx prisma migrate reset --force
# RUN npx prisma migrate dev --name init

# COPY . .

EXPOSE 3000

# CMD npx remix dev
# CMD npx prisma generate && npx remix dev
CMD npx prisma generate && nodemon --watch app --exec npx remix dev --legacy-watch