var path = require("path");
var fs = require( "fs" );

var pluginManagerFactory = function( _, anvil, testing ) {


	var dataPath = path.resolve( "./plugins.json" );
	var installPath = path.join( path.dirname( fs.realpathSync( __filename, "./" ) ), "../plugins/" );
	installPath = testing ? path.resolve( "./spec/plugins/" ) : installPath;

	var PluginManager = function() {
		_.bindAll( this );
		this.installPath = installPath;
		anvil.pluginManager = this;
	};

	PluginManager.prototype.getPlugins = function( done ) {
		var list = [];
		anvil.fs.read( dataPath, function( json, err ) {
			var plugins = JSON.parse( json );
			_.each( plugins.list, function( plugin ) {
				var pluginPath = anvil.fs.buildPath( [ installPath, plugin ] ),
					instance = require( path.resolve( pluginPath ) )( _, anvil ),
					metadata = { instance: instance, name: plugin };
				list.push( metadata );
				anvil.events.raise( "plugin.loaded", instance );
				anvil.log.debug( "loaded plugin " + plugin );
			} );
			done( list );
		} );
	};

	PluginManager.prototype.addPlugin = function( plugin, onComplete ) {
		anvil.fs.read( dataPath, function( json ) {
			var plugins = JSON.parse( json );
			if( ! _.any( plugins.list, function( name ) { return name === plugin; } ) ) {
				plugins.list.push( plugin );
				json = JSON.stringify( plugins, null, 4 );
				anvil.fs.write( dataPath, json, function( err ) {
					onComplete( err );
				} );
			} else {
				onComplete();
			}
		} );
	};

	PluginManager.prototype.removePlugin = function( plugin, onComplete ) {
		anvil.fs.read( dataPath, function( json ) {
			var plugins = JSON.parse( json );
			if( _.any( plugins.list, function( name ) { return name === plugin; } ) ) {
				plugins.list = _.reject( plugins.list, function( name ) { return name === plugin; } );
				json = JSON.stringify( plugins, null, 4 );
				anvil.fs.write( dataPath, json, function( err ) {
					onComplete( true, err );
				} );
			} else {
				onComplete( false );
			}
		} );
	};

	return new PluginManager();
};

module.exports = pluginManagerFactory;