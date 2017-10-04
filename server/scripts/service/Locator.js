const gdal = require('gdal');

/**
 * Class for finding out the region for specified coordinates
 */

class Locator {
    constructor() {
        this._regions = ["Ústecký", "Jihočeský", "Jihomoravský", "Karlovarský",
            "Královéhradecký", "Kraj Vysočina", "Liberecký", "Moravskoslezský",
            "Olomoucký", "Pardubický", "Plzeňský", "Praha", "Stredočeský", "Zlínský"];
        this._dataset = gdal.open("scripts/service/resources/CZE_adm1.shp");
    }

    /**
     * Finds the region where the point specified by latitude and longitude falls
     * @param {number} latitude
     * @param {number} longitude
     * @return {string} region - name of the region. Return null if not found.
     */
    find(latitude, longitude) {
        let point = new gdal.Point(longitude, latitude);
        let region = null;
        this._dataset.layers.get(0).features.forEach((feature, index) => {
            if (feature.getGeometry().contains(point)) {
                region = this._regions[index];
            }
        });
        return region;
    }
}

module.exports = Locator;
