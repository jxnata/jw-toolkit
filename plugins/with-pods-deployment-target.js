const fs = require('fs')
const path = require('path')
const { withDangerousMod } = require('expo/config-plugins')

// Some pods declare deployment targets below the minimum supported by recent Xcode versions,
// which fails the build. This bumps every pod target to at least the app's deployment target.
const MARKER = '# with-pods-deployment-target'

const withPodsDeploymentTarget = (config, { deploymentTarget = '16.4' } = {}) =>
	withDangerousMod(config, [
		'ios',
		async (cfg) => {
			const podfilePath = path.join(cfg.modRequest.platformProjectRoot, 'Podfile')
			const podfile = fs.readFileSync(podfilePath, 'utf8')

			if (podfile.includes(MARKER)) return cfg

			const snippet = `
    ${MARKER}
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |build_config|
        current = build_config.build_settings['IPHONEOS_DEPLOYMENT_TARGET']
        if current.nil? || Gem::Version.new(current) < Gem::Version.new('${deploymentTarget}')
          build_config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '${deploymentTarget}'
        end
      end
    end
`

			const updated = podfile.replace(/post_install do \|installer\|\n/, (match) => match + snippet)
			fs.writeFileSync(podfilePath, updated)

			return cfg
		},
	])

module.exports = withPodsDeploymentTarget
