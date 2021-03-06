var React = require('react/addons');
var Button = require('react-bootstrap/Button');
var Glyphicon = require('react-bootstrap/Glyphicon');

module.exports = React.createClass({
	
	getInitialState: function() {
		return { hide: true };
	},

	render: function() {
		
		var percent = this.props.volume * 100;
		var style = {top: (100 - percent) + "%"};
		var toggleIcon = this.props.volume == 0 ? "volume-off" : "volume-up";

		var cx = React.addons.classSet;
		var audioVolumeBarClasses = cx({
			'audio-volume-bar': true,
  		'audio-volume-bar-hide': this.state.hide
		});

		return (
			<div ref="audioVolumeBarContainer" className="audio-volume-bar-container">
				<Button ref="toggleButton" bsSize="small" onClick={this.toggle}>
					<Glyphicon glyph={toggleIcon}/>
				</Button>
				<div className={audioVolumeBarClasses}>
					<div className="audio-volume-min-max" onClick={this.volumeToMax}>
						<Glyphicon glyph="volume-up" />
					</div>
					<div ref="audioVolumePercentContainer" className="audio-volume-percent-container" onClick={this.adjustVolumeTo}>
						<div className="audio-volume-percent" style={style}></div>
					</div>
					<div className="audio-volume-min-max" onClick={this.volumeToMin}>
						<Glyphicon glyph="volume-off" />
					</div>
				</div>	
			</div>
		);
	},

	toggle: function() {

		// when bar open, do nothing if toggle btn press again
		if (this.isToggleBtnPress) {
			this.isToggleBtnPress = false;
			return;
		}

		var hide = !this.state.hide;
		if (hide) {
			return;
		}

		this.setState({ hide: false });
		this.globalClickHandler = $(document).mousedown(function(e) {
			var reactId = this.refs.audioVolumeBarContainer._rootNodeID;
			var toggleBtnReactId = this.refs.toggleButton._rootNodeID;
			node = e.target;
			while(node != null) {
				var nodeReactId =  $(node).attr('data-reactid');
				if (reactId == nodeReactId) {
					return;
				} else if (toggleBtnReactId == nodeReactId) {
					this.isToggleBtnPress = true;
					break;
				}
				node = node.parentNode;
			}
			this.globalClickHandler.unbind();
			this.globalClickHandler = null;
			this.setState({ hide: true });
		}.bind(this));
		
	},

	adjustVolumeTo: function(e) {
		var container = $(this.refs.audioVolumePercentContainer.getDOMNode());
		var containerStartY = container.offset().top;
		var percent = (e.clientY - containerStartY) / container.height();	
		percent = 1 - percent;
		this.props.adjustVolumeTo(percent);
	},

	volumeToMax: function() {
		this.props.adjustVolumeTo(1);
	},

	volumeToMin: function() {
		this.props.adjustVolumeTo(0);
	}

});