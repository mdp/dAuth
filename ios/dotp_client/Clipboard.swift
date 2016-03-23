//
//  Clipboard.swift
//  dotp_client
//
//  Created by Mark Percival on 3/16/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

import Foundation
import UIKit

@objc(Clipboard)
class Clipboard: NSObject {
  
  @objc func copyStr(str: String) -> Void {
    UIPasteboard.generalPasteboard().string = str
  }
  
}