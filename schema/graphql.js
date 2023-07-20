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
		id: { type: GraphQLID },
		user: {
			type: UserType,
			resolve(parent, args) {
				return UserModel.findOne({ username: parent.username });
			}
		},
		body: { type: GraphQLString },
		file: { type: GraphQLString },
		likes: {
			type: new GraphQLList(UserType),
			resolve(parent, args) {
				return parent.likes.map(userID => UserModel.findOne({ username: userID })); // optimize later
			}
		},
		comments: {
			type: new GraphQLList(CommentType),
			resolve(parent, args) {
				return parent.comments
			}
		},
		createdAt: { type: GraphQLString } // change it to appropriate Date type or handle it in the frontend
	})
});






const Mutation = new GraphQLObjectType({
	name: "Mutation",
	fields: {
		// CREATION
		createPost: {
			type: PostType,
			args: {
				username: { type: GraphQLString },
				body: { type: GraphQLString },
				file: { type: GraphQLString },
				createdAt: { type: GraphQLString } // check if the date goes in the proper format before adding to MongoDB
				// likes, comments are not taken as parameters here
			},
			resolve(parent, args) {
				const newPost = new PostModel({ ...args, likes: 0, comments: [] });
				return newPost.save();
			}
		},

		createUser: {
			type: UserType,
			args: {
				username: { type: GraphQLString },
				fullName: { type: GraphQLString },
				email: { type: GraphQLString },
				file: { type: GraphQLString },
				university: { type: GraphQLString },
				city: { type: GraphQLString },
				country: { type: GraphQLString },
				dialCode: { type: GraphQLString },
				mobile: { type: GraphQLString },
				// friends: [] to be initialized as empty array
			},
			resolve(parent, args) {
				const newUser = new UserModel({ ...args, friends: [] });
				return newUser.save();
			}
		},

		// DELETION
		deletePost: {
			type: PostType,
			args: {
				id: { type: GraphQLString }
			},
			resolve(parent, args) {
				return PostModel.findByIdAndDelete(args.id);
			}
		},

		deleteUser: {
			type: UserType,
			args: {
				username: { type: GraphQLString }
			},
			resolve(parent, args) {
				return UserModel.findOneAndDelete({ username: args.username });
			}
		}

		// UPDATION

	}
});

const RootQuery = new GraphQLObjectType({
	name: "RootQueryType",
	fields: {
		users: {
			type: new GraphQLList(UserType),
			resolve(parent, args) {
				return UserModel.find({});
			}
		},
		user: {
			type: UserType,
			args: { username: { type: GraphQLString } },
			resolve(parent, args) {
				// return UserModel.findById(args.id);
				return UserModel.findOne({ username: args.username });
			}
		},
		posts: {
			type: new GraphQLList(PostType),
			resolve(parent, args) {
				return PostModel.find({});
			}
		},
		post: {
			type: PostType,
			args: { id: { type: GraphQLID } },
			resolve(parent, args) {
				return PostModel.findById(args.id);
			}
		},

	}
});

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation
});