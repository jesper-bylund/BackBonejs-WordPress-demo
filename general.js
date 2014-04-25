// Post model
var Post = Backbone.Model.extend({
    defaults: {},
    idAttribute: 'ID',
});

// collection or loop of posts
var Posts = Backbone.Collection.extend({
    model: Post,
    url: 'https://public-api.wordpress.com/rest/v1/sites/jesperbylund.com/posts/?number=10&callback=?',
    initialize: function () {
        this.fetch({
            success: this.fetchSuccess,
            error: this.fetchError
        });
        this.deferred = new $.Deferred();
    },
    deferred: Function.constructor.prototype,
    fetchSuccess: function (collection, response) {
        collection.deferred.resolve();
    },
    fetchError: function (collection, response) {
        throw new Error("Fetch did not get collection from API");
    },
    parse: function( response ) {
      return response.posts;
    }
});

// Posts view
var PostsView = Backbone.View.extend({
    el: '#posts',
	
	events: {
		'click span.read': 'showStory',
	},

	initialize: function(){
        _.bindAll(this, 'createPost', 'showMore');
        this.$el.html('<h3>Loading posts</h3>');
        this.collection = new Posts();
        this.collection.bind('add', this.createPost);
        this.render();
    },

    render: function(){

        _(this.collection.models).each(function(post){ // in case collection is not empty
            this.createPost(post);
        }, this);
        return this;
    },
    createPost: function(post){
        var postView = new PostView({
            model: post
        });
        $('h3',this.$el).hide();
        this.$el.append( postView.render().el );
    },
    showMore: function(){
    	console.log('showMore');
    }
    
});

// post view
var PostView = Backbone.View.extend({
    tagName: 'div',
    className: 'post',
    events: {
        'click span.delete': 'unrender',
        'click h2': 'showPost',
    },

    initialize: function(){
        _.bindAll(this, 'remove', 'render','unrender', 'showPost');
        this.model.bind('change', this.render);
    },

    render: function(){
        this.$el.html('<div><img class="featured-image" src="'+this.model.get('featured_image')+'" /><h2>'+this.model.get('title')+'</h2></div>');
        return this;
    },

    unrender: function(){
        $(this.el).remove();
    },

    showPost: function(){
        
        $('div.content').removeClass('active');
        if( $('div.content', this.$el).length > 0 ){
            $('div.content', this.$el).addClass('active');
        } else {
            $('div', this.$el).append('<div class="content active">'+this.model.get('content')+'</div>' );    
        }
        $('html, body').animate({
            scrollTop: $('h2', this.$el).offset().top
        }, 500);
        
    }
});

$(document).ready(function() {
    var view = new PostsView();
});