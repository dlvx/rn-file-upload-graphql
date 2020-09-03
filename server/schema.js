const {
  gql,
  GraphQLUpload
} = require('apollo-server-express');

const uploadSchema = gql`
  type Query {
    _empty: String
  }
  type Mutation {
    uploadImage(
      image: Upload
    ): String
  }
`

module.exports = {
  typeDefs: [uploadSchema],
  resolvers: {
    Upload: GraphQLUpload,
    Mutation: {
      uploadImage: async (root, { image }, {
        Storage
      }) => {
        const folder = `rn-upload/`;
        try {
          const uploadResult = await Storage.upload(image, folder);
          return uploadResult.uri;
        } catch(e) {
          return new Error(e);
        }
      },
    }
  }
};