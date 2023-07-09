const mongooose = require("mongoose");
const UserModel = require("../models/userModel");
const PostModel = require("../models/postModel");
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLInt, GraphQLList, GraphQLSchema } = require("graphql");
const User = require("../models/userModel");


const UserType = new GraphQLObjectType({
	name: "user",
	fields: () => ({
		id: { type: GraphQLID },
		username: { type: GraphQLString },
		fullName: { type: GraphQLString },
		email: { type: GraphQLString },
		file: { type: GraphQLString },
		university: { type: GraphQLString },
		city: { type: GraphQLString },
		country: { type: GraphQLString },
		dialCode: { type: GraphQLString },
		mobile: { type: GraphQLString },
		friends: {
			type: new GraphQLList(UserType),
			resolve(parent, args) {
				return parent.friends.map(friendID => UserModel.findById(friendID)); // optimize later
			}
		}
	})
});

const CommentType = new GraphQLObjectType({
	name: "comment",
	fields: () => ({
		user: {
			type: UserType,
			resolve(parent, args) {
				return UserModel.findOne({ username: parent.username })
			}
		},
		commentString: { type: GraphQLString },
		displayImage: { type: GraphQLString }
	})
})

const PostType = new GraphQLObjectType({
	name: "post",
	fields: () => ({
		user: {
			type: UserType,
			resolve(parent, args) {
				return UserModel.findOne({ username: parent.username });
			}
		},
		body: { type: GraphQLString },
		file: { type: GraphQLString },
		likes: { type: GraphQLString },
		comments: {
			type: new GraphQLList(CommentType),
			resolve(parent, args) {
				return parent.comments
			}
		},
		createdAt: { type: GraphQLString } // change it to appropriate Date type or handle it in the frontend
	})
});






let Mutations; // let's do this later 

const RootQuery = new GraphQLObjectType({
	name: "RootQueryType",
	fields: {
		user: {
			type: UserType,
			args: { username: { type: GraphQLString } },
			resolve(parent, args) {
				// return UserModel.findById(args.id);
				return UserModel.findOne({ username: args.username });
			}
		},
		post: {
			type: PostType,
			args: { id: { type: GraphQLID } },
			resolve(parent, args) {
				return PostModel.findById(args.id);
			}
		}
	}
});

module.exports = new GraphQLSchema({
	query: RootQuery
});