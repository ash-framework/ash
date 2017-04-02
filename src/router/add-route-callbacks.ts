import * as path from 'path'
import createCallback from './create-callback'
import loadFile from './load-file'
import fileExists from './file-exists'
import { Registry, Container } from '@glimmer/di'

const allowedMethods = ['get', 'put', 'post', 'patch', 'delete', 'options', 'head']

function addRouteCallbacks(routeObjects: Array<any>, options: any) {
  const container = options.container
  const objects = []
  routeObjects.forEach(routeObj => {
    if (routeObj.name === 'index') return

    if (routeObj.children.length > 0) {
      const sameNamedChild = routeObj.children.filter(children => children.name === routeObj.name)[0]
      if (!sameNamedChild || (sameNamedChild && sameNamedChild.path !== '/')) {
        // implicit routes
        allowedMethods.forEach(method => {
          let Route = container.factoryFor(`route:index:${method.toLowerCase()}`)
          if (Route) {
            objects.push({
              method: method,
              callback: createCallback(Route, routeObj.name),
              name: 'index',
              path: routeObj.path
            })
          }
        })
      }
      objects.push({
        path: routeObj.path,
        children: addRouteCallbacks(routeObj.children, path.join(options.routesDir, routeObj.name))
      })
    } else {
      // explicit routes
      allowedMethods.forEach(method => {
        let Route = container.factoryFor(`route:${routeObj.name}:${method}`)
        if (Route) {
          objects.push({
            method: method,
            callback: createCallback(Route),
            name: routeObj.name,
            path: routeObj.path
          })
        }
      })
    }
  })
  return objects
}

export default addRouteCallbacks
